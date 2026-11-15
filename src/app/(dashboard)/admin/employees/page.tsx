"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteEmployee } from "@/features/employees/hooks/useDeleteEmployee";
import type { IEmployee } from "@/features/employees/types/employee.type";
import { getEmployees } from "@/features/employees/api/getEmployee";
import Button from "@/components/ui/Button";
import EmployeeFormModal from "@/features/employees/components/EmployeeFormModal";
import EmployeeFilters from "@/features/employees/components/EmployeeFilters";
import EmployeeList from "@/features/employees/components/EmployeeList";

const EmployeePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const {
    data: employees = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["employees", department],
    queryFn: () => getEmployees(department),
  });

  const { mutate: removeEmployee, isPending: isDeleting } = useDeleteEmployee();

  const filteredEmployees = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return employees.filter((employee) => {
      return (
        employee.firstName.toLowerCase().includes(searchValue) ||
        employee.lastName.toLowerCase().includes(searchValue) ||
        employee.department.toLowerCase().includes(searchValue) ||
        employee.position.toLowerCase().includes(searchValue)
      );
    });
  }, [employees, search]);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmed) return;

    removeEmployee(id, {
      onSuccess: () => {
        toast.success("Employee deleted successfully!");
      },
      onError: (error) => {
        console.error("Delete employee error:", error);
        toast.error("Failed to delete employee");
      },
    });
  };

  if (isPending) {
    return <p className="p-5">Loading employees...</p>;
  }

  if (isError) {
    return <p className="p-5 text-rose-500">Failed to load employees.</p>;
  }

  return (
    <div className="p-5">
      <header className="mb-8 ml-15 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center lg:ml-0">
        <div>
          <h1 className="text-xl font-bold">Employees</h1>
          <p className="text-sm text-gray-500">Manage your team members</p>
        </div>

        <Button onClick={handleAddEmployee}>
          <Plus size={16} />
          Add Employee
        </Button>
      </header>

      {isModalOpen && (
        <EmployeeFormModal
          close={handleCloseModal}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}

      <EmployeeFilters
        search={search}
        department={department}
        onSearchChange={setSearch}
        onDepartmentChange={setDepartment}
      />

      <EmployeeList
        employees={filteredEmployees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default EmployeePage;
