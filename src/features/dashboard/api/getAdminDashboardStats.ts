import { clientApi } from "@/lib/api/clientApi";

import type { IAdminDashboardStats } from "../types/adminDashboard.type";

export const getAdminDashboardStats =
  async (): Promise<IAdminDashboardStats> => {
    const { data } =
      await clientApi.get<IAdminDashboardStats>("/api/dashboard");

    return data;
  };
