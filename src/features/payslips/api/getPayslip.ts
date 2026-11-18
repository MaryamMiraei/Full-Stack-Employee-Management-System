import { clientApi } from "@/lib/api/clientApi";
import type { IPayslipResponse } from "../types/payslips.type";


export const getPayslip = async (
  payslipID: string,
): Promise<IPayslipResponse> => {
  const response = await clientApi.get<IPayslipResponse>(
    `/api/payslips/${payslipID}`,
  );

  return response.data;
};
