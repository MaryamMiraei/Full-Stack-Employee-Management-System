import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPayslip } from "../api/createPayslip";

export const useCreatePayslip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayslip,

    onSuccess: (newPayslip) => {
      queryClient.invalidateQueries({
        queryKey: ["payslips"],
      });

      queryClient.setQueryData(["payslips", newPayslip.id], newPayslip);
    },
  });
};
