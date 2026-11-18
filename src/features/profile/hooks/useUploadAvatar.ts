import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IUserProfile } from "../types/profile.type";
import { uploadAvatar } from "../api/uploadAvatar";

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),

    onSuccess: (data) => {
      queryClient.setQueryData<IUserProfile>(["profile"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          profileImage: data.profileImage,
        };
      });
    },
  });
};
