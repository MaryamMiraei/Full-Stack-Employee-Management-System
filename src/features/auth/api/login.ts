import { clientApi } from "@/lib/api/clientApi";



export const loginUser = async (
  credentials: ILoginRequest,
): Promise<ILoginResponse> => {
  const response = await clientApi.post<ILoginResponse>(
    "/api/auth/login",
    credentials,
  );

  return response.data;
};
