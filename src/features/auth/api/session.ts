import { clientApi } from "@/lib/api/clientApi";

export const getSession = async (
  signal?: AbortSignal,
): Promise<ISessionResponse> => {
  const response = await clientApi.get<ISessionResponse>("/api/auth/session", {
    signal,
  });

  return response.data;
};
