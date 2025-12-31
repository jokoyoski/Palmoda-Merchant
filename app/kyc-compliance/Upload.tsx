"use client";
import React from "react";
import { FaFileUpload } from "react-icons/fa";
import { useAuth } from "../_lib/AuthContext";

type DocumentStatus = "pending" | "approved" | "revoked" | undefined;

function UploadBox({
  title,
  fileUrl,
  onUploadClick,
  inputRef,
  onFileChange,
  isUploading,
  status,
}: {
  title: string;
  fileUrl: string;
  onUploadClick: () => void;
  inputRef: any;
  isUploading: boolean;
  onFileChange: (e: any) => void;
  status?: DocumentStatus;
}) {
  const { user } = useAuth();

  // Disable only when vendor is fully verified
  const isDisabled = isUploading || user?.is_verified;
  const isPdf = fileUrl?.endsWith(".pdf");

  // Status badge styles
  const getStatusBadge = () => {
    if (!status || !fileUrl) return null;

    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      revoked: "bg-red-100 text-red-800 border-red-300",
    };

    const labels = {
      pending: "Pending",
      approved: "Approved",
      revoked: "Revoked",
    };

    return (
      <span
        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold rounded border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-1 w-full md:w-[230px]">
      <h1 className="text-black font-semibold text-xs">{title}</h1>

      {/* If file uploaded → show preview */}
      {fileUrl ? (
        <div className="relative border-2 border-gray-300 p-2 rounded-md h-[180px] flex flex-col items-center justify-center bg-gray-50">
          {getStatusBadge()}
          {isPdf ? (
            <p className="text-center text-sm text-black font-semibold">PDF Uploaded</p>
          ) : (
            <img
              src={fileUrl}
              className="w-full mt-3.5 h-full object-contain rounded"
              alt="Uploaded file"
            />
          )}

          <button
            className={`bg-black text-white mt-2 p-[5px] text-xs ${ isDisabled? "cursor-not-allowed" : ""} `}
            onClick={onUploadClick}
            disabled={isDisabled}
            type="button"
          >
            Change File
          </button>
        </div>
      ) : (
        /* No file yet → show upload box */
        <div className="border-2 p-4 border-gray-300 h-[180px] border-dashed flex flex-col justify-center items-center">
          <FaFileUpload className="text-gray-300 mb-2" />
          <p className="text-gray-500 mb-2 text-xs">click to upload</p>
          <p className="text-gray-500 mb-2 text-[10px] text-center">
            Accepted formats: PDF, JPG, PNG (Max 5MB)
          </p>
          <button
            className="bg-black text-white p-[5px] text-xs"
            onClick={onUploadClick}
            disabled={isUploading}
            type="button"
          >
            Upload Document
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
        accept=".pdf,image/*"
      />
    </div>
  );
}


export default UploadBox;