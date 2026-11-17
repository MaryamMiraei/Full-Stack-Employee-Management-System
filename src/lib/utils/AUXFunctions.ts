export const getInitials = (name: string) => {
  return name
    .trim()
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const formatDate = (date: string) => date.split("T")[0];

export const getMonthName = (month: number) => {
  return new Date(2000, month - 1).toLocaleString("en-US", {
    month: "long",
  });
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const formatText = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());


import type { LeaveStatus } from "@/features/leaves/types/leave.type";

export const getLeaveStatusStyle = (status: LeaveStatus) => {
  const styles: Record<LeaveStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return styles[status];
};