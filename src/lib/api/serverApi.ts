import "server-only";

import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createApiInstance } from "./axios";

export const serverApi = createApiInstance("");

serverApi.interceptors.request.use(async (config) => {
  const { env } = getCloudflareContext();

  const cloudflareEnv = env as unknown as Record<string, string | undefined>;

  const apiUrl = cloudflareEnv.API_URL;
  const apiKey = cloudflareEnv.DEMO_API_KEY;

  if (!apiUrl) {
    throw new Error("API_URL is not configured");
  }

  config.baseURL = apiUrl;

  if (apiKey) {
    config.headers.set("x-demo-api-key", apiKey);
  }

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
