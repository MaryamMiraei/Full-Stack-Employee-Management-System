import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkIn } from "../api/checkIn";

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkIn,

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
