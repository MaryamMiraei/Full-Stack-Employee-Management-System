"use client";

import { CalendarDays, Clock, CircleAlert } from "lucide-react";

import StatCard from "@/components/ui/StatCard";
import { useGetAttendanceSummary } from "../hooks/useGetAttendanceSummary";

const formatHours = (minutes: number) => {
  return `${(minutes / 60).toFixed(1)} Hrs`;
};

const AttendanceSummary = () => {
  const { data, isLoading, isError } = useGetAttendanceSummary();

  if (isLoading) {
    return <p>Loading summary...</p>;
  }

  if (isError) {
    return <p>Failed to load attendance summary.</p>;
  }

  const summaryCards = [
    {
      title: "Days Present",
      statusNumber: data?.daysPresent ?? 0,
      icon: <CalendarDays size={24} />,
    },
    {
      title: "Late Arrivals",
      statusNumber: data?.lateArrivals ?? 0,
      icon: <CircleAlert size={24} />,
    },
    {
      title: "Average Work Hours",
      statusNumber: formatHours(data?.averageWorkMinutes ?? 0),
      icon: <Clock size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

export default AttendanceSummary;
