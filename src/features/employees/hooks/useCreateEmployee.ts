import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "../api/createEmployee";

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-employee"],
    mutationFn: createEmployee,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};
