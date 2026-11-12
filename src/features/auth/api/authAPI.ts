import { clientApi } from "@/lib/api/clientApi";

interface ISigninData {
  email: string;
  password: string;
  role_type: "admin" | "employee";
}

interface ISigninResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: "admin" | "employee";
  };
}

export const signin = async (data: ISigninData) => {
  const response = await clientApi.post<ISigninResponse>(
    "/api/auth/login",
    data,
  );

  return response.data;
};
