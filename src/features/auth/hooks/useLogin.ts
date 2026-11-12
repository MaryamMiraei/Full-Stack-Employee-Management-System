import { clientApi } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";

const loginUser = async (
  credentials: ILoginRequest,
): Promise<ILoginResponse> => {
  const response = await clientApi.post<ILoginResponse>(
    "/api/auth/login",
    credentials,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
  });
};

export default useLogin;
// const loginUser = async (
//   credentials: ILoginRequest,
// ): Promise<ILoginResponse> => {
//   const response = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }

//   return data;
// };
