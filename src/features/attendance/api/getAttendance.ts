import type { IAttendance } from "../types/attendance.type";
import { clientApi } from "@/lib/api/clientApi";

export const getAttendance = async (month?: string) => {
  const response = await clientApi.get<IAttendance[]>("/api/attendance", {
    params: month ? { month } : undefined,
  });

  return response.data;
};
