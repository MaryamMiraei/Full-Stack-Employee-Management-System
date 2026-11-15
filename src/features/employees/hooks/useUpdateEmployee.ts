import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployee } from "../api/updateEmployee";

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-employee"],
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};
