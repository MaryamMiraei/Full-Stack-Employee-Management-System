import { clientApi } from "@/lib/api/clientApi";
import type { IUpdateProfileRequest, IUserProfile } from "../types/profile.type";

export const updateProfile = async (data: IUpdateProfileRequest) => {
  const response = await clientApi.patch<IUserProfile>("/api/profile", data);

  return response.data;
};
