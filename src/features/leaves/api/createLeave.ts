import { clientApi } from "@/lib/api/clientApi";
import type { ICreateLeaveRequest, ILeave } from "../types/leave.type";

export const createLeave = async (
  payload: ICreateLeaveRequest,
): Promise<ILeave> => {
  const { data } = await clientApi.post<ILeave>("/api/leaves", payload);

  return data;
};