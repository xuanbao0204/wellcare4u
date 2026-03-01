import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "./tokenStore";
import { authEvents } from "./authEvent";

interface CustomConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});


api.interceptors.request.use((config) => {
    const token = tokenStore.getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;

type QueueItem = {
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((p) => {
        if (error) {
            p.reject(error);
        } else if (token) {
            p.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomConfig;

        const status = error.response?.status;
        const requestUrl = originalRequest?.url;
        if (
            status !== 401 ||
            !originalRequest ||
            requestUrl?.includes("/auth/login") ||
            requestUrl?.includes("/auth/refresh") ||
            !tokenStore.getToken()
        ) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const newToken = await refreshAccessToken();

            tokenStore.setToken(newToken);

            processQueue(null, newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        } catch (err) {
            processQueue(err, null);

            tokenStore.clear();
            authEvents.emitLogout();

            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;

const refreshAccessToken = async (): Promise<string> => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
    );

    return res.data.accessToken;
};