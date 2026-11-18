import { useMutation, useQueryClient } from "@tanstack/react-query";


import type { IUpdateProfileRequest } from "../types/profile.type";
import { updateProfile } from "../api/updateProfile";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateProfileRequest) => updateProfile(data),

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
    },
  });
};
