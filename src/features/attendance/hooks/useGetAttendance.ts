import { useQuery } from "@tanstack/react-query";
import { getAttendance } from "../api/getAttendance";

export const useGetAttendance = (month?: string) => {
  return useQuery({
    queryKey: ["attendance", month],
    queryFn: () => getAttendance(month),
  });
};
