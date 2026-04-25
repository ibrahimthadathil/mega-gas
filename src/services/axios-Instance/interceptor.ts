// import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// const controllerMap = new Map<string | undefined, AbortController>();

// export const axiosInstance = (baseURL: string): AxiosInstance => {
//   const instance = axios.create({
//     baseURL,
//     withCredentials: true,
//   });

//   // ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────────
//   instance.interceptors.request.use(
//     async (config: InternalAxiosRequestConfig) => {
//       const token = localStorage.getItem("access_token");

//       // 1. Attach token to every request if it exists
//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       } else {
//         // No token → user is not authenticated, abort immediately
//         const controller = new AbortController();
//         controller.abort("No access token found. User is not authenticated.");
//         config.signal = controller.signal;
//         return config;
//       }

//       // 2. Abort controller per URL (cancels duplicate/previous requests)
//       if (!config.signal) {
//         const controller = new AbortController();
//         config.signal = controller.signal;
//         controllerMap.set(config.url, controller);
//       }

//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // ─── RESPONSE INTERCEPTOR ──────────────────────────────────────────────────
//   instance.interceptors.response.use(
//     (response) => response, // pass through successful responses

//     async (error) => {
//       const originalRequest = error.config;

//       // 3. Handle 401 → token expired, attempt refresh once
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           // Call your refresh endpoint (cookie-based or body-based)
//           const { data } = await axios.post(
//             `${baseURL}/auth/refresh`,
//             {},
//             { withCredentials: true }
//           );

//           const newToken = data.access_token;
//           localStorage.setItem("access_token", newToken);

//           // Retry the original request with the new token
//           originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//           return instance(originalRequest);

//         } catch (refreshError) {
//           // Refresh failed → session expired, force logout
//           localStorage.removeItem("access_token");
//           window.location.href = "/login";
//           return Promise.reject(refreshError);
//         }
//       }

//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

// lib/axios/axiosInstance.ts
console.log("✅ Interceptor file loaded");
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
const controllerMap = new Map<string | undefined, AbortController>();
let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

function resolveQueue(success: boolean) {
  refreshQueue.forEach((cb) => cb(success));
  refreshQueue = [];
}

const api: AxiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true, // sends httpOnly cookies automatically
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[REQUEST] ${config.method?.toUpperCase()} → ${config.url}`);
    const existing = controllerMap.get(config.url);
    if (existing) {
      console.warn(`[DUPLICATE] Cancelled previous request to ${config.url}`);

      existing.abort("Duplicate request");
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    controllerMap.set(config.url, controller);

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    console.log(`[RESPONSE] ${response.status} ← ${response.config.url}`);
    controllerMap.delete(response.config.url);
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (axios.isCancel(error)) return Promise.reject(error);
    console.log("working response");

    // Token expired → attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((success) =>
            success ? resolve(api(originalRequest)) : reject(error),
          );
        });
      }

      isRefreshing = true;
      try {
        await axios.post(
          "/api/user/auth/refresh",
          {},
          { withCredentials: true },
        );
        resolveQueue(true);
        return api(originalRequest);
      } catch {
        resolveQueue(false);
        window.location.href = `/user/login?from=${window.location.pathname}`;
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

export default api;
