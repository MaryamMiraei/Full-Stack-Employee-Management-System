import { clientApi } from "@/lib/api/clientApi";
import type { IPayslipResponse } from "../types/payslips.type";


export const getPayslips = async (): Promise<IPayslipResponse[]> => {
  const response = await clientApi.get<IPayslipResponse[]>("/api/admin/payslips");

  return response.data;
};
