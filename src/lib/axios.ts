import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let resolveAuthReady!: () => void;

const authReadyPromise = new Promise<void>((resolve) => {
  resolveAuthReady = resolve;
});

export const markAuthReady = () => resolveAuthReady();

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeTokenRefresh = (cb: () => void) => refreshSubscribers.push(cb);

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const onRefreshFailed = () => {
  refreshSubscribers = [];
};

const NON_RETRYABLE = ["/auth/refresh", "/auth/login", "/auth/register", "/auth/logout", "/otp/send", "/otp/verify", "/otp/resend", "/forgot-password", "/reset-password"];

const refreshToken = () =>
  axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const isAuthEndpoint = config.url?.includes("/auth");
  if (!isAuthEndpoint) {
    await authReadyPromise;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthError = status === 401 || status === 403;

    if (!isAuthError || originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (NON_RETRYABLE.some((ep) => originalRequest.url?.includes(ep))) {
      return Promise.reject(error);
    }

    const contentType = String(originalRequest.headers?.["Content-Type"] ?? "");
    if (contentType.includes("multipart/form-data")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          api(originalRequest).then(resolve).catch(reject);
        });
      });
    }

    isRefreshing = true;

    try {
      await refreshToken();
      onRefreshed();
      return api(originalRequest);
    } catch (err) {
      onRefreshFailed();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;