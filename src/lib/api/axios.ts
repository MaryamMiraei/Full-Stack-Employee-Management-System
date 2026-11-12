import axios from "axios";

export const createApiInstance = (baseURL: string) => {
  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
