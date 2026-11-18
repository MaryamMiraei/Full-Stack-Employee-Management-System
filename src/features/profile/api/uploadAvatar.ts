import { clientApi } from "@/lib/api/clientApi";

export interface IUploadAvatarResponse {
  message: string;
  profileImage: string;
}

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await clientApi.post<IUploadAvatarResponse>(
    "/api/profile/avatar",
    formData,
  );

  return response.data;
};
