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

const NON_RETRYABLE = ["/auth/refresh", "/auth/login", "/auth/register", "/auth/logout"];

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

// import axios, { InternalAxiosRequestConfig } from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// let resolveAuthReady!: () => void;
// let rejectAuthReady!: (reason?: unknown) => void;

// const authReadyPromise = new Promise<void>((resolve, reject) => {
//   resolveAuthReady = resolve;
//   rejectAuthReady = reject;
// });

// export const markAuthReady = () => resolveAuthReady();
// export const markAuthFailed = () => rejectAuthReady(new Error("Auth failed"));

// let isRefreshing = false;
// let refreshSubscribers: Array<() => void> = [];

// const subscribeTokenRefresh = (cb: () => void) => refreshSubscribers.push(cb);

// const onRefreshed = () => {
//   refreshSubscribers.forEach((cb) => cb());
//   refreshSubscribers = [];
// };

// const onRefreshFailed = () => {
//   refreshSubscribers = [];
// };

// const refreshToken = () =>
//   axios.post(
//     `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//     {},
//     { withCredentials: true }
//   );

// api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
//   const isAuthEndpoint = config.url?.includes("/auth");

//   if (!isAuthEndpoint) {
//     await authReadyPromise;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;

//     const isAuthError = status === 401 || status === 403;

//     if (!isAuthError || originalRequest?._retry) {
//       return Promise.reject(error);
//     }

//     if (originalRequest.url?.includes("/auth")) {
//       return Promise.reject(error);
//     }

//     const contentType = String(originalRequest.headers?.["Content-Type"] ?? "");
//     if (contentType.includes("multipart/form-data")) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         subscribeTokenRefresh(() => {
//           api(originalRequest).then(resolve).catch(reject);
//         });
//       });
//     }

//     isRefreshing = true;

//     try {
//       await refreshToken();
//       onRefreshed();
//       return api(originalRequest);
//     } catch (err) {
//       onRefreshFailed();
//       window.dispatchEvent(new Event("auth:logout"));
//       return Promise.reject(err);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

// export default api;

// import axios, { InternalAxiosRequestConfig } from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// let isAuthReady = false;

// if (typeof window !== "undefined") {
//   window.addEventListener("auth:ready", () => { isAuthReady = true; }, { once: true });
//   window.addEventListener("auth:logout", () => { isAuthReady = false; });
// }

// let isRefreshing = false;
// let refreshSubscribers: Array<() => void> = [];

// const subscribeTokenRefresh = (cb: () => void) => {
//   refreshSubscribers.push(cb);
// };

// const onRefreshed = () => {
//   refreshSubscribers.forEach((cb) => cb());
//   refreshSubscribers = [];
// };

// const onRefreshFailed = () => {
//   refreshSubscribers = [];
// };

// const refreshToken = () =>
//   axios.post(
//     `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//     {},
//     { withCredentials: true }
//   );

// api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const isAuthEndpoint = config.url?.includes("/auth");
//   if (!isAuthReady && !isAuthEndpoint) {
//     // Return a proper Error so catch blocks get a real .message
//     return Promise.reject(new Error("Auth not ready"));
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status !== 401 || originalRequest?._retry) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         subscribeTokenRefresh(() => {
//           api(originalRequest).then(resolve).catch(reject);
//         });
//       });
//     }

//     isRefreshing = true;

//     try {
//       await refreshToken();
//       onRefreshed();
//       return api(originalRequest);
//     } catch (err) {
//       onRefreshFailed();
//       window.dispatchEvent(new Event("auth:logout"));
//       return Promise.reject(err);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

// export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// let isAuthReady = false;

// export const setAxiosAuthReady = (v: boolean) => {
//     isAuthReady = v;
// };

// let isRefreshing = false;
// let refreshSubscribers: Array<(token: string | null) => void> = [];

// const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
//   refreshSubscribers.push(cb);
// };

// const onRefreshed = (token: string | null) => {
//   refreshSubscribers.forEach((cb) => cb(token));
//   refreshSubscribers = [];
// };

// const refreshToken = async () => {
//   return axios.post(
//     `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//     {},
//     { withCredentials: true }
//   );
// };

// api.interceptors.request.use((config) => {
//     const isAuthRequest = config.url?.includes("/auth");

//     if (!isAuthReady && !isAuthRequest) {
//         return Promise.reject({
//             message: "Auth not ready",
//         });
//     }
//     return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status !== 401 || originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     if (isRefreshing) {
//       return new Promise((resolve) => {
//         subscribeTokenRefresh(() => {
//           resolve(api(originalRequest));
//         });
//       });
//     }

//     isRefreshing = true;

//     try {
//       await refreshToken();

//       onRefreshed(null);

//       return api(originalRequest);
//     } catch (err) {
//       onRefreshed(null);
//       window.location.href = "/login";
//       return Promise.reject(err);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

// export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let queue: Array<(token: string | null) => void> = [];

// const processQueue = (token: string | null) => {
//   queue.forEach((cb) => cb(token));
//   queue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status !== 401 ||
//       originalRequest._retry
//     ) {
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     if (isRefreshing) {
//       return new Promise((resolve) => {
//         queue.push(() => {
//           resolve(api(originalRequest));
//         });
//       });
//     }

//     isRefreshing = true;

//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//         {},
//         { withCredentials: true }
//       );

//       processQueue(null);

//       return api(originalRequest);
//     } catch (err) {
//       processQueue(null);
//       window.location.href = "/login";
//       return Promise.reject(err);
//     } finally {
//       isRefreshing = false;
//     }
//   }
// );

// export default api;

// api.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError) => {
//     const status = error.response?.status;
//     const requestUrl = error.config?.url;
//     if (
//       status === 401 &&
//       requestUrl &&
//       !requestUrl.includes("/auth/login") &&
//       !requestUrl.includes("/auth/refresh")
//     ) {
//       return Promise.reject({ message: "Chưa đăng nhập hoặc token hết hạn", originalError: error });
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

