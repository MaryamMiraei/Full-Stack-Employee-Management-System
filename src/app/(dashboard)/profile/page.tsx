"use client";

import { useGetProfile } from "@/features/profile/hooks/useGetProfile";

import ProfileHeader from "@/features/profile/components/ProfileHeader";
import EditProfileForm from "@/features/profile/components/EditProfileForm";
import EmploymentInfo from "@/features/profile/components/EmploymentInfo";
import { useState } from "react";
import { useUploadAvatar } from "@/features/profile/hooks/useUploadAvatar";
import Button from "@/components/ui/Button";

const ProfilePage = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { mutate: uploadAvatar, isPending } = useUploadAvatar();

  const handleSaveAvatar = () => {
    if (!avatarFile) return;

    uploadAvatar(avatarFile, {
      onSuccess: () => {
        setAvatarFile(null);
      },
    });
  };

  const { data: profile, isLoading, isError, refetch } = useGetProfile();

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (isError || !profile) {
    return (
      <div className="space-y-3">
        <p>Failed to load profile.</p>

        <button onClick={() => refetch()} className="text-red-600 underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information and account details.
        </p>
      </div>

      <ProfileHeader profile={profile} onAvatarChange={setAvatarFile} />
      {avatarFile && (
        <div className="flex items-center gap-3">
          <Button onClick={handleSaveAvatar} disabled={isPending}>
            {isPending ? "Uploading..." : "Save Photo"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => setAvatarFile(null)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      )}

      {profile.role === "employee" ? (
        <>
          <EditProfileForm />
          <EmploymentInfo profile={profile} />
        </>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold">Account Information</h3>
          <p className="text-sm text-gray-500 mt-2">
            Personal profile editing for administrators will be added in the
            next step.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
