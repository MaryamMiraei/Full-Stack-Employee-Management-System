import { clientApi } from "@/lib/api/clientApi";

export const logoutUser = async (): Promise<void> => {
  await clientApi.post("/api/auth/logout");
};
