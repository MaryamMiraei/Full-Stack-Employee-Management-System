"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface IProfileAvatarProps {
  firstName: string;
  lastName: string;
  profileImage: string | null;
  size?: "sm" | "md" | "lg";
  onFileSelect?: (file: File | null) => void;
}

const ProfileAvatar = ({
  firstName,
  lastName,
  profileImage,
  size = "lg",
  onFileSelect,
}: IProfileAvatarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-xl",
    lg: "w-24 h-24 text-3xl",
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be less than 2 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleRemoveSelection = () => {
    setSelectedFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onFileSelect?.(null);
  };

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const imageSource = previewUrl || profileImage;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} overflow-hidden rounded-full bg-red-900 flex items-center justify-center text-white font-semibold`}
        >
          {imageSource ? (
            <img
              src={imageSource}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenFilePicker}
          className="absolute bottom-0 right-0 rounded-full bg-red-800 p-2 text-white hover:bg-red-900"
          aria-label="Choose profile image"
        >
          <Camera size={16} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleOpenFilePicker}
          className="text-sm text-red-600 hover:underline"
        >
          Change photo
        </button>

        {selectedFile && (
          <button
            type="button"
            onClick={handleRemoveSelection}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
          >
            <X size={14} />
            Cancel
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      <p className="text-xs text-gray-500">
        JPG, PNG or WEBP. Maximum size: 2 MB.
      </p>
    </div>
  );
};

export default ProfileAvatar;
