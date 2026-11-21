"use client";

import { Users, Building2, CalendarDays, FileText } from "lucide-react";

import StatCard from "@/components/ui/StatCard";
import { useAdminDashboardStats } from "../hooks/useGetAdminDashboardStats";

const AdminDashboardCard = () => {
  const { data, isLoading, isError } = useAdminDashboardStats();

  if (isLoading) {
    return <p>Loading dashboard statistics...</p>;
  }

  if (isError || !data) {
    return <p>Failed to load dashboard statistics.</p>;
  }

  const summaryCards = [
    {
      title: "Total Employees",
      statusNumber: data.totalEmployees,
      icon: <Users size={24} />,
    },
    {
      title: "Departments",
      statusNumber: data.totalDepartments,
      icon: <Building2 size={24} />,
    },
    {
      title: "Today's Attendance",
      statusNumber: data.todayAttendance,
      icon: <CalendarDays size={24} />,
    },
    {
      title: "Pending Leaves",
      statusNumber: data.pendingLeaves,
      icon: <FileText size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {summaryCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          statusNumber={card.statusNumber}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default AdminDashboardCard;
