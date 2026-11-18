import axios from "axios";

export const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    return config;
  });

  return instance;
};
