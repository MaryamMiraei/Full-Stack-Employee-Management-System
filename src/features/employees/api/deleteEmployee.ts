import { clientApi } from "@/lib/api/clientApi";

export const deleteEmployee = async (id: string) => {
  const response = await clientApi.delete(`/api/admin/employees/${id}`);

  return response.data;
};
