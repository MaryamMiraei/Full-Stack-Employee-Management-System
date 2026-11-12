import { createApiInstance } from "./axios";

export const clientApi = createApiInstance("");

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
