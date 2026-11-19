"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import type { IChangePasswordRequest } from "../types/changePassword.type";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormArea from "@/components/ui/FormArea";
import { useChangePassword } from "../hooks/useChangePassword";

const ChangePasswordForm = () => {
  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<IChangePasswordRequest>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = (data: IChangePasswordRequest) => {
    changePassword(data, {
      onSuccess: () => {
        toast.success("Password changed successfully");
        reset();
      },
      onError: () => {
        toast.error("Failed to change password");
      },
    });
  };

  return (
    <FormArea title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Current Password"
            id="currentPassword"
            type="password"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            error={errors.currentPassword?.message}
          />

          <Input
            label="New Password"
            id="newPassword"
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 72,
                message: "Password is too long",
              },
            })}
            error={errors.newPassword?.message}
          />

          <Input
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Change Password"}
          </Button>
        </div>
      </form>
    </FormArea>
  );
};

export default ChangePasswordForm;
