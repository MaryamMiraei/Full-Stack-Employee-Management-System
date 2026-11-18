"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useGetProfile } from "../hooks/useGetProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

import type { IUpdateProfileRequest } from "../types/profile.type";
import { toast } from "react-toastify";

const EditProfileForm = () => {
  const { data: profile } = useGetProfile();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }, watch
  } = useForm<IUpdateProfileRequest>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      bio: "",
    },
  });

  console.log(watch("firstName"))
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
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
      <h3 className="text-lg font-semibold">Personal Information</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm mb-2">First Name</label>

            <input
              {...register("firstName", {
                required: "First name is required",
                maxLength: 50,
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-3 outline-none"
            />

            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2">Last Name</label>

            <input
              {...register("lastName", {
                required: "Last name is required",
                maxLength: 50,
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-3 outline-none"
            />

            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2">Phone</label>

            <input
              {...register("phone", {
                maxLength: 20,
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Bio</label>

            <textarea
              {...register("bio", {
                maxLength: 500,
              })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-3 outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-800 hover:bg-red-900 text-white px-6 py-2.5 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProfileForm;
