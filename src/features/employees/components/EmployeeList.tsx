import type { IEmployee } from "../types/employee.type";
import EmployeeCard from "./EmployeeCard";

interface IEmployeeList {
  employees: IEmployee[];
  onEdit: (employee: IEmployee) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const EmployeeList = ({
  employees,
  onEdit,
  onDelete,
  isDeleting,
}: IEmployeeList) => {
  if (employees.length === 0) {
    return (
      <p className="col-span-full py-10 text-center text-slate-500">
        No employees found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default EmployeeList;
