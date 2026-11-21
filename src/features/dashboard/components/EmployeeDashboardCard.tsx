"use client";

import { CalendarDays, FileText, DollarSign } from "lucide-react";

import StatCard from "@/components/ui/StatCard";

import { useGetAttendanceSummary } from "@/features/attendance/hooks/useGetAttendanceSummary";
import { useGetLeaves } from "@/features/leaves/hooks/useGetLeaves";
import { usePayslips } from "@/features/payslips/hooks/useGetPayslips";

const EmployeeDashboardStats = () => {
  const {
    data: attendanceSummary,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useGetAttendanceSummary();

  const {
    data: leaves,
    isLoading: leavesLoading,
    isError: leavesError,
  } = useGetLeaves();

  const {
    data: payslips,
    isLoading: payslipsLoading,
    isError: payslipsError,
  } = usePayslips();

  const isLoading = attendanceLoading || leavesLoading || payslipsLoading;

  const isError = attendanceError || leavesError || payslipsError;

  if (isLoading) {
    return <p>Loading dashboard statistics...</p>;
  }

  if (isError) {
    return <p>Failed to load dashboard statistics.</p>;
  }

  // Count pending leave requests
  const pendingLeaves =
    leaves?.filter((leave) => leave.status === "PENDING").length ?? 0;

  // Find the latest payslip based on year and month
  const latestPayslip = [...(payslips ?? [])].sort(
    (a, b) => b.year - a.year || b.month - a.month,
  )[0];

  // Format latest payslip amount
  const latestPayslipAmount = latestPayslip
    ? `$${latestPayslip.netSalary.toLocaleString("en-US")}`
    : "--";

  const summaryCards = [
    {
      title: "Days Present",
      statusNumber: attendanceSummary?.daysPresent ?? 0,
      icon: <CalendarDays size={24} />,
    },
    {
      title: "Pending Leaves",
      statusNumber: pendingLeaves,
      icon: <FileText size={24} />,
    },
    {
      title: "Latest Payslip",
      statusNumber: latestPayslipAmount,
      icon: <DollarSign size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

export default EmployeeDashboardStats;
