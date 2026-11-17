import { clientApi } from "@/lib/api/clientApi";

import type { ILeaveWithEmployee } from "../types/leave.type";

export const getLeaves = async (): Promise<ILeaveWithEmployee[]> => {
  const { data } = await clientApi.get<ILeaveWithEmployee[]>("/api/leaves");

  return data;
};
