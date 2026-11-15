import { useQuery } from "@tanstack/react-query";

import { getPayslips } from "../api/getPayslips";

export const usePayslips = () => {
  return useQuery({
    queryKey: ["payslips"],
    queryFn: getPayslips,
  });
};
