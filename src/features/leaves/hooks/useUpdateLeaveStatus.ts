import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLeaveStatus } from "../api/updateLeaveStatus";

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeaveStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });
    },
  });
};
