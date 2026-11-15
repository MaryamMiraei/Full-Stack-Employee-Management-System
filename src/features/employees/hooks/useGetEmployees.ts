import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../api/getEmployee";

export const useGetEmployees = (department?: string) => {
  return useQuery({
    queryKey: ["employees", department],
    queryFn: () => getEmployees(department ?? ""),
  });
};
