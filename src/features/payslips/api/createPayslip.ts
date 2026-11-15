import { clientApi } from "@/lib/api/clientApi";
import type { ICreatePayslipRequest, IPayslipResponse } from "../types/payslips.type";

export const createPayslip = async (
  data: ICreatePayslipRequest,
): Promise<IPayslipResponse> => {
  const response = await clientApi.post<IPayslipResponse>(
    "/api/admin/payslips",
    data,
  );

  return response.data;
};
