import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLeave } from "../api/createLeave";

export const useCreateLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeave,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });
    },
  });
};
