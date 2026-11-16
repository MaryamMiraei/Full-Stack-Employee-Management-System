import { clientApi } from "@/lib/api/clientApi";
import type { ILeaveSummary } from "../types/leave.type";

export const getLeaveSummary = async (year: number): Promise<ILeaveSummary> => {
  const response = await clientApi.get<ILeaveSummary>(
    `/api/leaves/summary?year=${year}`,
  );

  return response.data;
};
