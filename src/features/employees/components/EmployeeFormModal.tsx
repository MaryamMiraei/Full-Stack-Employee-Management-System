"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "@/components/ui/Button";
import FormArea from "@/components/ui/FormArea";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/TextArea";

import { useCreateEmployee } from "@/features/employees/hooks/useCreateEmployee";
import { useUpdateEmployee } from "@/features/employees/hooks/useUpdateEmployee";

import { formatDate } from "@/lib/utils/AUXFunctions";

import type {
  EmployeeFormData,
  ICreateEmployeeRequest,
  IEmployee,
} from "../types/employee.type";

interface IEmployeeModal {
  setSelectedEmployee: React.Dispatch<React.SetStateAction<IEmployee | null>>;
  selectedEmployee: IEmployee | null;
  close: () => void;
}

const EmployeeFormModal = ({
  close,
  selectedEmployee,
  setSelectedEmployee,
}: IEmployeeModal) => {
  const isEditMode = Boolean(selectedEmployee);

  const { register, handleSubmit, reset, watch } = useForm<EmployeeFormData>({
    shouldUnregister: true,
    defaultValues: {
      allowances: 0,
      basicSalary: 0,
      bio: "",
      deductions: 0,
      department: "",
      email: "",
      employmentStatus: "ACTIVE",
      firstName: "",
      joinDate: "",
      lastName: "",
      phone: "",
      position: "",
    },
  });
  console.log(watch("email"));

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();

  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();

  const isSubmitting = isCreating || isUpdating;

  const handleClose = () => {
    reset();
    setSelectedEmployee(null);
    close();
  };

  const handleEmployeeSubmit = (data: EmployeeFormData) => {
    const { password, ...employeeData } = data;

    // Edit Employee
    if (selectedEmployee) {
      updateEmployee(
        {
          id: selectedEmployee.id,
          data: {
            ...employeeData,
            updatedAt: new Date().toISOString(),
          },
        },
        {
          onSuccess: () => {
            toast.success("Employee updated successfully!");
            handleClose();
          },
          onError: (error) => {
            console.error("Update employee error:", error);
            toast.error("Failed to update employee");
          },
        },
      );

      return;
    }

    // Create Employee
    const newEmployee: ICreateEmployeeRequest = {
      ...employeeData,
      password: password!,
    };

    createEmployee(newEmployee, {
      onSuccess: () => {
        toast.success("Employee created successfully!");
        handleClose();
      },
      onError: (error) => {
        console.error("Create employee error:", error);
        toast.error("Failed to create employee");
      },
    });
  };

  useEffect(() => {
    if (selectedEmployee) {
      reset({
        allowances: selectedEmployee.allowances,
        basicSalary: selectedEmployee.basicSalary,
        bio: selectedEmployee.bio,
        deductions: selectedEmployee.deductions,
        department: selectedEmployee.department,
        email: selectedEmployee.email,
        employmentStatus: selectedEmployee.employmentStatus,
        firstName: selectedEmployee.firstName,
        joinDate: formatDate(selectedEmployee.joinDate),
        lastName: selectedEmployee.lastName,
        phone: selectedEmployee.phone,
        position: selectedEmployee.position,
      });
    } else {
      reset({
        allowances: 0,
        basicSalary: 0,
        bio: "",
        deductions: 0,
        department: "",
        email: "",
        employmentStatus: "ACTIVE",
        firstName: "",
        joinDate: "",
        lastName: "",
        phone: "",
        position: "",
      });
    }
  }, [selectedEmployee, reset]);

  const onValid = (data: EmployeeFormData) => {
    console.log("FORM DATA:", data);
    console.log("PASSWORD:", JSON.stringify(data.password));
    console.log("PASSWORD LENGTH:", data.password?.length);

    handleEmployeeSubmit(data);
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    console.log("FORM ERRORS:", errors);
  };

  return (
    <Modal
      close={handleClose}
      title={isEditMode ? "Edit Employee" : "Add New Employee"}
      description={
        isEditMode
          ? "Update employee details"
          : "Create a user account and employee profile"
      }
    >
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(onValid, onInvalid)}
      >
        <FormArea title="Personal Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              type="text"
              id="firstName"
              label="First Name"
              placeholder="First Name"
              {...register("firstName", {
                required: "First name is required",
              })}
            />

            <Input
              type="text"
              id="lastName"
              label="Last Name"
              placeholder="Last Name"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />

            <Input
              type="tel"
              id="phone"
              label="Phone Number"
              placeholder="Phone"
              {...register("phone", {
                required: "Phone number is required",
              })}
            />

            <Input
              type="date"
              id="joinDate"
              label="Join Date"
              {...register("joinDate", {
                required: "Join date is required",
              })}
            />
          </div>

          <Textarea
            label="Bio (Optional)"
            id="bio"
            placeholder="Brief description..."
            {...register("bio")}
          />
        </FormArea>

        <FormArea title="Employment Details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input
              type="text"
              id="department"
              label="Department"
              {...register("department", {
                required: "Department is required",
              })}
            />

            <Input
              type="text"
              id="position"
              label="Position"
              {...register("position", {
                required: "Position is required",
              })}
            />

            <Input
              type="number"
              min={0}
              id="basicSalary"
              label="Basic Salary"
              {...register("basicSalary", {
                valueAsNumber: true,
                required: "Basic salary is required",
                min: 0,
              })}
            />

            <Input
              type="number"
              min={0}
              id="allowances"
              label="Allowances"
              {...register("allowances", {
                valueAsNumber: true,
                required: true,
                min: 0,
              })}
            />

            <Input
              type="number"
              min={0}
              id="deductions"
              label="Deductions"
              {...register("deductions", {
                valueAsNumber: true,
                required: true,
                min: 0,
              })}
            />
          </div>

          <div>
            <label htmlFor="employmentStatus">Employment Status</label>

            <select
              id="employmentStatus"
              className="w-full"
              {...register("employmentStatus", {
                required: true,
              })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </FormArea>

        <FormArea title="Account Setup">
          <Input
            type="email"
            id="email"
            label="Work Email"
            {...register("email", {
              required: "Email is required",
            })}
          />

          {!isEditMode && (
            <Input
              type="password"
              id="password"
              label="Temporary Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
          )}
        </FormArea>

        <div className="mt-5 mb-3 flex gap-3 justify-end items-center">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : isEditMode
                ? "Update Employee"
                : "Create Employee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeFormModal;
