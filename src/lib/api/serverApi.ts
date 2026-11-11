import "server-only";

import { cookies } from "next/headers";
import { createApiInstance } from "./axios";

export const serverApi = createApiInstance(process.env.API_URL!);

serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  if (cookieHeader) {
    config.headers.set("Cookie", cookieHeader);
  }

  return config;
});
