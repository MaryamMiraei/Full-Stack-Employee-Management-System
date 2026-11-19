
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useGetProfile } from "../hooks/useGetProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

import type { IUpdateProfileRequest } from "../types/profile.type";

import Input from "@/components/ui/Input";

import Button from "@/components/ui/Button";
import FormArea from "@/components/ui/FormArea";
import Textarea from "@/components/ui/TextArea";
import { Save } from "lucide-react";

const EditProfileForm = () => {
  const { data: profile } = useGetProfile();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUpdateProfileRequest>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        bio: profile.bio,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: IUpdateProfileRequest) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    });
  };

  return (
    <FormArea title="Personal Information">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="First Name"
            id="firstName"
            {...register("firstName", {
              required: "First name is required",
              maxLength: {
                value: 50,
                message: "Maximum 50 characters",
              },
            })}
            error={errors.firstName?.message}
          />

          <Input
            label="Last Name"
            id="lastName"
            {...register("lastName", {
              required: "Last name is required",
              maxLength: {
                value: 50,
                message: "Maximum 50 characters",
              },
            })}
            error={errors.lastName?.message}
          />

          <Input
            label="Phone"
            id="phone"
            {...register("phone", {
              maxLength: {
                value: 20,
                message: "Maximum 20 characters",
              },
            })}
            error={errors.phone?.message}
          />

          <Textarea
            label="Bio"
            id="bio"
            rows={3}
            {...register("bio", {
              maxLength: {
                value: 500,
                message: "Maximum 500 characters",
              },
            })}
            error={errors.bio?.message}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} icon={<Save size={16}/>}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </FormArea>
  );
};

export default EditProfileForm;
