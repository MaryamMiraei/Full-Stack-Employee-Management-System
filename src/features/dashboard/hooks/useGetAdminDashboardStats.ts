import { useQuery } from "@tanstack/react-query";

import { getAdminDashboardStats } from "../api/getAdminDashboardStats";

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getAdminDashboardStats,
  });
};
