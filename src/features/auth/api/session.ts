import { clientApi } from "@/lib/api/clientApi";


export const getSession = async (): Promise<ISessionResponse> => {
  const response = await clientApi.get<ISessionResponse>("/api/auth/session");

  return response.data;
};
