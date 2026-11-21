"use client";

import { useEffect, useState } from "react";
import { useCheckIn } from "../hooks/useCheckIn";
import { useCheckOut } from "../hooks/useCheckOut";
import { useGetAttendance } from "../hooks/useGetAttendance";

import Button from "@/components/ui/Button";

const getTodayDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.NEXT_PUBLIC_ATTENDANCE_TIME_ZONE || "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const AttendanceActions = () => {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(getTodayDate());
  }, []);

  const { data: attendance, isLoading } = useGetAttendance();

  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const todayAttendance = attendance?.find((item) => item.date === today);

  const isInProgress = todayAttendance?.status === "IN_PROGRESS";
  const isCompleted = todayAttendance?.status === "COMPLETED";

  if (isLoading) {
    return <p>Loading attendance...</p>;
  }

  return (
    <div className="flex items-center gap-3">
      {!todayAttendance && (
        <Button
          variant="primary"
          onClick={() => checkInMutation.mutate()}
          disabled={checkInMutation.isPending}
        >
          {checkInMutation.isPending ? "Checking In..." : "Check In"}
        </Button>
      )}

      {isInProgress && (
        <Button
          variant="danger"
          onClick={() => checkOutMutation.mutate()}
          disabled={checkOutMutation.isPending}
        >
          {checkOutMutation.isPending ? "Checking Out..." : "Check Out"}
        </Button>
      )}

      {isCompleted && (
        <p className="text-green-600 font-medium">
          Your attendance is completed for today.
        </p>
      )}
    </div>
  );
};

export default AttendanceActions;
