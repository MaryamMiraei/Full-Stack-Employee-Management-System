import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/login";

const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
  });
};

export default useLogin;
