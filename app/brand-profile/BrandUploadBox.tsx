"use client";
import React, { ChangeEvent } from "react";
import { FaFileUpload } from "react-icons/fa";
import { useAuth } from "../_lib/AuthContext";

interface BrandUploadBoxProps {
  title: string;
  fileUrl: string;
  onUploadClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  minSize?: string;
  bgColor?: string;
  textColor?: string;
  height?: string;
}

const BrandUploadBox: React.FC<BrandUploadBoxProps> = ({
  title,
  fileUrl,
  onUploadClick,
  inputRef,
  onFileChange,
  description = "Drag & drop your file here",
  minSize = "",
  bgColor = "bg-white",
  textColor = "text-gray-500",
  height = "h-32",
}) => {
  const {user} = useAuth();
    const isDisabled = user?.is_bank_information_verified || user?.is_business_verified || user?.is_identity_verified;
  
  
  return (
    <div className="flex flex-col gap-2">
      <label className="text-black font-semibold text-xs">{title}</label>

      <div
        className={`border-2 border-dashed border-gray-300 ${bgColor} rounded-md flex flex-col items-center justify-center transition relative ${height} 
             ${isDisabled ? "cursor-not-allowed opacity-60 bg-gray-100" : "cursor-pointer hover:bg-gray-50"}`}
        // 👇 FIX: Disable onClick handler if isDisabled is true
        onClick={isDisabled ? undefined : onUploadClick}
      >
        {fileUrl ? (
          // ✅ Show image preview
          <img
            src={fileUrl}
            alt="Uploaded"
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <>
            <FaFileUpload className={`${textColor} mb-2`} />
            <p className={`${textColor} text-xs mb-1`}>{description}</p>
            <button
              className={`px-3 py-1 text-xs rounded-sm ${
                bgColor === "bg-black" ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              Upload File
            </button>
            {minSize && <p className="text-gray-400 text-[10px] mt-1">{minSize}</p>}
          </>
        )}

        <input
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};

export default BrandUploadBox;
