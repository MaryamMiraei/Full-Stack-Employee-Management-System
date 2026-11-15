import { useQuery } from "@tanstack/react-query";

import { getPayslip } from "../api/getPayslip";

export const usePayslip = (payslipID: string) => {
  return useQuery({
    queryKey: ["payslips", payslipID],
    queryFn: () => getPayslip(payslipID),
    enabled: Boolean(payslipID),
  });
};
