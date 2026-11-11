import { createApiInstance } from "./axios";

export const clientApi = createApiInstance(process.env.NEXT_PUBLIC_API_URL!);

// Attach token to client-side requests
clientApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
