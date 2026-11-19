import { useMutation } from "@tanstack/react-query";

import { changePassword } from "../api/changePassword";
import type { IChangePasswordRequest } from "../types/changePassword.type";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: IChangePasswordRequest) => changePassword(data),
  });
};
