import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  statusNumber: number | string;
  icon: ReactNode;
}

const StatCard = ({ title, statusNumber, icon }: StatCardProps) => {
  return (
    <div
      className="p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between border border-slate-500/10 rounded-md hover:-translate-y-0.5 transition-transform duration-300"
    >
      <div>
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70"></div>

        <p className="text-sm font-medium text-slate-700">{title}</p>

        <p className="text-2xl font-bold text-slate-900 mt-1">{statusNumber}</p>
      </div>

      {icon}
    </div>
  );
};

export default StatCard;
