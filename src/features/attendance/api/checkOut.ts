import type { ICheckOutResponse } from "../types/attendance.type";
import { clientApi } from "@/lib/api/clientApi";

export const checkOut = async () => {
  const response = await clientApi.patch<ICheckOutResponse>(
    "/api/attendance/check-out",
  );

  return response.data;
};
