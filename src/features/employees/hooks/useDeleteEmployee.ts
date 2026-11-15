import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteEmployee } from "../api/deleteEmployee";

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-employee"],
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};
