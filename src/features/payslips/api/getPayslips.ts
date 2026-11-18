import { clientApi } from "@/lib/api/clientApi";
import type { IPayslip, IPayslipResponse } from "../types/payslips.type";

export const getPayslips = async (): Promise<IPayslipResponse[]> => {
  const { data } = await clientApi.get<IPayslipResponse[]>("/api/payslips");

  return data;
};
