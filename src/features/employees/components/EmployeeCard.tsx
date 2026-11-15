"use client";

import { getInitials } from "@/lib/utils/AUXFunctions";
import type { IEmployee } from "../types/employee.type";
import { Pencil, Trash2 } from "lucide-react";


interface IEmployeeCard {
  employee: IEmployee;
  onEdit: (employee: IEmployee) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const EmployeeCard = ({
  employee,
  onEdit,
  onDelete,
  isDeleting,
}: IEmployeeCard) => {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-slate-300">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-slate-100 to-slate-50">
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-100 to-slate-100">
            <span className="text-2xl font-medium text-indigo-400">
              {getInitials(employee.firstName)}
              {getInitials(employee.lastName)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-3 top-3">
        <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm">
          {employee.department}
        </span>
      </div>

      <div className="absolute inset-0 flex items-end justify-center gap-3 bg-linear-to-t from-indigo-700/20 via-transparent to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button
          type="button"
          title="Edit employee"
          aria-label="Edit employee"
          onClick={() => onEdit(employee)}
          className="rounded-xl bg-white/90 p-2.5 text-slate-700 shadow-lg transition-all hover:scale-105 hover:text-indigo-600"
        >
          <Pencil size={17} />
        </button>

        <button
          type="button"
          title="Delete employee"
          aria-label="Delete employee"
          disabled={isDeleting}
          onClick={() => onDelete(employee.id)}
          className="rounded-xl bg-white/90 p-2.5 text-slate-700 shadow-lg transition-all hover:scale-105 hover:text-rose-600 disabled:opacity-50"
        >
          <Trash2 size={17} />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-slate-900">
          {employee.firstName} {employee.lastName}
        </h3>

        <p className="text-xs text-slate-500">{employee.position}</p>
      </div>
    </article>
  );
};

export default EmployeeCard;
