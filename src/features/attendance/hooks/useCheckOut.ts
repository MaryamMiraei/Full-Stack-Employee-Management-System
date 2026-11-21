import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkOut } from "../api/checkOut";

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkOut,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });

      queryClient.invalidateQueries({
        queryKey: ["attendance-summary"],
      });
    },
  });
};
