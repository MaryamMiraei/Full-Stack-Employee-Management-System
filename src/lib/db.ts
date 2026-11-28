import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const getDB = () => {
  const { env } = getCloudflareContext();

  return env.DB;
};
