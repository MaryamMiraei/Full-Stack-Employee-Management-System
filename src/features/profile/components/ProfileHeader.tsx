"use client";

import type { IUserProfile } from "../types/profile.type";
import ProfileAvatar from "./ProfileAvatar";

interface IProfileHeaderProps {
  profile: IUserProfile;
  onAvatarChange: (file: File | null) => void;
}

const ProfileHeader = ({ profile, onAvatarChange }: IProfileHeaderProps) => {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <ProfileAvatar
        firstName={profile.firstName}
        lastName={profile.lastName}
        profileImage={profile.profileImage}
        size="lg"
        onFileSelect={onAvatarChange}
      />

      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-xl font-semibold">{fullName || "User"}</h2>

        <p className="text-sm text-gray-500">{profile.email}</p>

        <span className="inline-block rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs">
          {profile.role === "admin" ? "Administrator" : "Employee"}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
