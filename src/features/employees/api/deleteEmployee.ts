import { clientApi } from "@/lib/api/clientApi";

export const deleteEmployee = async (id: string) => {
  const response = await clientApi.delete(`/api/employees/${id}`);

  return response.data;
};
