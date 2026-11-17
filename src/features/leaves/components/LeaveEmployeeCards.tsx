"use client"
import StatCard from "@/components/ui/StatCard";
import { useGetLeaveSummary } from "../hooks/useGetLeaveSummary";
import { DollarSign, Thermometer, TreePalm, Umbrella } from "lucide-react";

const LeaveEmployeeCards = () => {
  const { data: summary, isPending, isError } = useGetLeaveSummary();

  if (isPending) {
    return <p>Loading leave summary...</p>;
  }

  if (isError || !summary) {
    return <p>Failed to load leave summary.</p>;
  }

  const leaveCards = [
    {
      id: "annual",
      title: "Annual Leave",
      days: summary.byType.ANNUAL,
      icon: <TreePalm />,
    },
    {
      id: "sick",
      title: "Sick Leave",
      days: summary.byType.SICK,
      icon: <Thermometer />,
    },
    {
      id: "unpaid",
      title: "Unpaid Leave",
      days: summary.byType.UNPAID,
      icon: <DollarSign />,
    },
    {
      id: "casual",
      title: "Casual Leave",
      days: summary.byType.CASUAL,
      icon: <Umbrella />,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {leaveCards.map((card) => (
        <StatCard key={card.id} icon={card.icon} title={card.title} statusNumber={card.days} />
      ))}
    </div>
  );
};

export default LeaveEmployeeCards;
