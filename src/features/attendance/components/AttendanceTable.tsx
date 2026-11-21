"use client";

import Table, { type IColumn } from "@/components/ui/Table";

import { useGetAttendance } from "../hooks/useGetAttendance";
import type { IAttendance } from "../types/attendance.type";

import { formatDate, formatText } from "@/lib/utils/AUXFunctions";
import { formatTime } from "@/lib/utils/attendance.utils";

const AttendanceTable = () => {
  const { data, isLoading, isError } = useGetAttendance();

  const columns: IColumn<IAttendance>[] = [
    {
      key: "date",
      title: "Date",
      render: (row) => formatDate(row.date),
    },
    {
      key: "checkIn",
      title: "Check In",
      render: (row) => formatTime(row.checkIn),
    },
    {
      key: "checkOut",
      title: "Check Out",
      render: (row) => (row.checkOut ? formatTime(row.checkOut) : "--"),
    },
    {
      key: "workingMinutes",
      title: "Working Hours",
      render: (row) =>
        row.workingMinutes !== null
          ? `${(row.workingMinutes / 60).toFixed(1)} Hrs`
          : "In Progress",
    },
    {
      key: "dayType",
      title: "Day Type",
      render: (row) => formatText(row.dayType),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {formatText(row.status)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <p>Loading attendance...</p>;
  }

  if (isError) {
    return <p>Failed to load attendance records.</p>;
  }

  return (
    <Table
      columns={columns}
      data={data ?? []}
      rowKey="id"
      emptyMessage="No attendance records found."
    />
  );
};

export default AttendanceTable;
