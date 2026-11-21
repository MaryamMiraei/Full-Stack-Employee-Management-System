import type { ICheckInResponse } from "../types/attendance.type";
import { clientApi } from "@/lib/api/clientApi";

export const checkIn = async () => {
  const response = await clientApi.post<ICheckInResponse>(
    "/api/attendance/check-in",
  );

  return response.data;
};
