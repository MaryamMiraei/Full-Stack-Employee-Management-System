import { clientApi } from "@/lib/api/clientApi";
import type { ICreateEmployeeRequest } from "../types/employee.type";

export const createEmployee = async (data: ICreateEmployeeRequest) => {
  const response = await clientApi.post("/api/admin/employees", data);

  return response.data;
};
