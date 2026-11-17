"use client";

import { toast } from "react-toastify";

import Table, { type IColumn } from "@/components/ui/Table";

import {
  formatDate,
  formatText,
  getLeaveStatusStyle,
} from "@/lib/utils/AUXFunctions";

import { useGetLeaves } from "../hooks/useGetLeaves";
import { useUpdateLeaveStatus } from "../hooks/useUpdateLeaveStatus";

import type { ILeaveWithEmployee } from "../types/leave.type";

const LeaveAdminTable = () => {
  const { data: leaves, isLoading, isError } = useGetLeaves();

  const { mutate: updateStatus, isPending } = useUpdateLeaveStatus();

  const handleStatusChange = (
    leaveId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    updateStatus(
      {
        leaveId,
        payload: { status },
      },
      {
        onSuccess: () => {
          toast.success(
            status === "APPROVED"
              ? "Leave approved successfully"
              : "Leave rejected successfully",
          );
        },
        onError: () => {
          toast.error("Failed to update leave status");
        },
      },
    );
  };

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Something went wrong!</p>;

  const columns: IColumn<ILeaveWithEmployee>[] = [
    {
      key: "employee",
      title: "Employee",
      render: (row) =>
        row.employee
          ? `${row.employee.firstName} ${row.employee.lastName}`
          : "Unknown employee",
    },
    {
      key: "type",
      title: "Type",
      render: (row) => formatText(row.type),
    },
    {
      key: "dates",
      title: "Dates",
      render: (row) =>
        `${formatDate(row.startDate)} / ${formatDate(row.endDate)}`,
    },
    {
      key: "reason",
      title: "Reason",
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getLeaveStatusStyle(
            row.status,
          )}`}
        >
          {formatText(row.status)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) =>
        row.status === "PENDING" ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(row.id, "APPROVED")}
              className="rounded-lg bg-green-400 px-3 py-1.5 text-xs text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Approve
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(row.id, "REJECTED")}
              className="rounded-lg bg-red-400 px-3 py-1.5 text-xs text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Reviewed</span>
        ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={leaves ?? []}
        rowKey="id"
        emptyMessage="No leave applications found"
      />
    </div>
  );
};

export default LeaveAdminTable;
