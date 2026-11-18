import { clientApi } from "@/lib/api/clientApi";
import type { IEmployee } from "../types/employee.type";

export const getEmployees = async (department: string) => {
  const response = await clientApi.get<IEmployee[]>("/api/employees", {
    params: {
      ...(department && { department }),
      isDeleted: false,
    },
  });

  return response.data;
};
