import { clientApi } from "@/lib/api/clientApi";
import type {
  IChangePasswordRequest,
  IChangePasswordResponse,
} from "../types/changePassword.type";

export const changePassword = async ({
  currentPassword,
  newPassword,
}: IChangePasswordRequest) => {
  const response = await clientApi.post<IChangePasswordResponse>(
    "/api/profile/change-password",
    {
      currentPassword,
      newPassword,
    },
  );

  return response.data;
};
