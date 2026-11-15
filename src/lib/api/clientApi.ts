import { createApiInstance } from "./axios";

export const clientApi = createApiInstance("");


clientApi.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";

      // خطای ورود ناموفق نباید باعث هدایت مجدد شود
      if (requestUrl.includes("/api/auth/login")) {
        return Promise.reject(error);
      }

      // جلوگیری از اجرای چندباره عملیات خروج
      if (
        typeof window !== "undefined" &&
        !sessionStorage.getItem("session-expired")
      ) {
        sessionStorage.setItem("session-expired", "true");

        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

// Attach token to client-side requests
// clientApi.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });
