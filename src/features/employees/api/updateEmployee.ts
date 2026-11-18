import { clientApi } from "@/lib/api/clientApi";
import type { IEmployee } from "../types/employee.type";

interface IUpdateEmployeeParams {
  id: string;
  data: Partial<IEmployee>;
}

export const updateEmployee = async ({ id, data }: IUpdateEmployeeParams) => {
  const response = await clientApi.patch(`/api/employees/${id}`, data);

  return response.data;
};
