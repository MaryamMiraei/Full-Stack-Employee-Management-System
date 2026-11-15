
"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Modal from "@/components/ui/Modal";
import Select, { type SelectOption } from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { months } from "@/data/months";
import type { ICreatePayslipRequest } from "../types/payslips.type";
import { useCreatePayslip } from "../hooks/useCreatePayslip";
import { useGetEmployees } from "@/features/employees/hooks/useGetEmployees";


interface IPayslipsModal {
  close: () => void;
}

const AdminPayslipsModal = ({ close }: IPayslipsModal) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreatePayslipRequest>({
    defaultValues: {
      year: new Date().getFullYear(),
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
    },
  });

  // Get employees
  const {
    data: employees = [],
    isPending: isEmployeesPending,
    isError: isEmployeesError,
  } = useGetEmployees();

  // Create payslip
  const {
    mutate: createPayslip,
    isPending: isCreating,
  } = useCreatePayslip();

  const onSubmit = (data: ICreatePayslipRequest) => {
    createPayslip(data, {
      onSuccess: () => {
        toast.success("Payslip generated successfully");
        close();
      },
      onError: () => {
        toast.error("Failed to generate payslip");
      },
    });
  };

  if (isEmployeesPending) {
    return <p>Loading employees...</p>;
  }

  if (isEmployeesError) {
    return <p>Failed to load employees.</p>;
  }

  const employeeOptions: SelectOption[] = employees.map((employee) => ({
    label: `${employee.firstName} ${employee.lastName} (${employee.position})`,
    value: employee.id,
  }));

  return (
    <Modal
      maxWeight="max-w-lg"
      title="Generate Monthly Payslip"
      description=""
      close={close}
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Select
          options={employeeOptions}
          label="Employee"
          id="employee"
          error={errors.employeeId?.message}
          {...register("employeeId", {
            required: "Please select an employee",
          })}
        />

        <div className="flex justify-between items-start gap-3">
          <Select
            options={months}
            label="Month"
            id="month"
            error={errors.month?.message}
            {...register("month", {
              required: "Please select month",
              valueAsNumber: true,
              validate: (value) =>
                (Number.isInteger(value) && value >= 1 && value <= 12) ||
                "Please select a valid month",
            })}
          />

          <Input
            type="number"
            label="Year"
            id="year"
            error={errors.year?.message}
            {...register("year", {
              required: "This field is necessary",
              valueAsNumber: true,
              min: {
                value: 2000,
                message: "Year must be at least 2000",
              },
              validate: (value) =>
                Number.isInteger(value) || "Please enter a valid year",
            })}
          />
        </div>

        <Input
          type="number"
          min={0}
          label="Basic Salary"
          id="basicSalary"
          error={errors.basicSalary?.message}
          {...register("basicSalary", {
            required: "This field is necessary",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Salary cannot be negative",
            },
          })}
        />

        <div className="flex justify-between items-start gap-3">
          <Input
            type="number"
            min={0}
            label="Allowances"
            id="allowances"
            error={errors.allowances?.message}
            {...register("allowances", {
              required: "This field is necessary",
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Allowances cannot be negative",
              },
            })}
          />

          <Input
            type="number"
            min={0}
            label="Deductions"
            id="deductions"
            error={errors.deductions?.message}
            {...register("deductions", {
              required: "This field is necessary",
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Deductions cannot be negative",
              },
            })}
          />
        </div>

        <div className="mt-5 mb-3 flex gap-3 justify-end items-center">
          <Button
            type="button"
            variant="secondary"
            onClick={close}
            disabled={isCreating}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminPayslipsModal;
