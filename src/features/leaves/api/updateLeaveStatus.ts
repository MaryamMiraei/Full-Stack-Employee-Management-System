import { clientApi } from "@/lib/api/clientApi";

import type { ILeave, IUpdateLeaveStatusRequest } from "../types/leave.type";

export const updateLeaveStatus = async ({
  leaveId,
  payload,
}: {
  leaveId: string;
  payload: IUpdateLeaveStatusRequest;
}): Promise<ILeave> => {
  const { data } = await clientApi.patch<ILeave>(
    `/api/leaves/${leaveId}`,
    payload,
  );

  return data;
};
