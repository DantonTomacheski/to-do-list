import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import { compressImageToBase64 } from "@/utils/imageCompression";
import { useUserStore } from "@/store/userStore";

interface PhotoUploadProps {
  onChange: (photoBase64: string | null) => void;
  value?: string | null;
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onChange,
  value = null,
  className = "",
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressedImageBase64 = await compressImageToBase64(file);
      
      // Call the provided onChange callback
      onChange(compressedImageBase64);
      
      // Also update the user store directly
      const updateUser = useUserStore.getState().updateUser;
      updateUser({ photo: compressedImageBase64 });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    // Call the provided onChange callback
    onChange(null);
    
    // Also update the user store directly
    const updateUser = useUserStore.getState().updateUser;
    updateUser({ photo: null });
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative mb-3">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-purple"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
              aria-label={t("removePhoto")}
            >
              <X size={16} className="text-pink" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {/* Directly display the fixed default avatar if value is null/empty */}
            <img
              src="https://avatar.iran.liara.run/public/2" // Use fixed default URL
              alt={t("defaultAvatar", "Default Avatar")}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={triggerFileInput}
          className="text-sm text-purple flex items-center gap-1"
        >
          <Upload size={16} />
          {t("uploadPhoto")}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label={t("photo")}
      />
    </div>
  );
};

export default PhotoUpload;
