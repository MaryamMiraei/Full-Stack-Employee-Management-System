import type { IAttendanceSummary } from "../types/attendance.type";
import { clientApi } from "@/lib/api/clientApi";

export const getAttendanceSummary = async () => {
  const response = await clientApi.get<IAttendanceSummary>(
    "/api/attendance/summary",
  );

  return response.data;
};
