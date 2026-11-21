import { useQuery } from "@tanstack/react-query";
import { getAttendanceSummary } from "../api/getAttendanceSummary";

export const useGetAttendanceSummary = () => {
  return useQuery({
    queryKey: ["attendance-summary"],
    queryFn: getAttendanceSummary,
  });
};
