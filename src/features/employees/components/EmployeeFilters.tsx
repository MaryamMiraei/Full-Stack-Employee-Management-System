"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { departmentOptions } from "@/constants/departmentItems";
import { Search } from "lucide-react";

interface IEmployeeFilters {
  search: string;
  department: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}


const EmployeeFilters = ({
  search,
  department,
  onSearchChange,
  onDepartmentChange,
}: IEmployeeFilters) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1 flex items-center outline-none">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />

        <Input
          id="employee-search"
          type="search"
          placeholder="Search employees..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full pl-10"
        
        />
      </div>

      <div className="w-full sm:w-56">
        <Select
          id="department-filter"
          options={departmentOptions}
          value={department}
          onChange={(event) => onDepartmentChange(event.target.value)}
          placeholderShow={false}
        />
      </div>
    </div>
  );
};

export default EmployeeFilters;
