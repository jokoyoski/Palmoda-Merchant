"use client";
import React, { useState } from "react";
import { FaFilePdf, FaFileUpload } from "react-icons/fa";
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
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  // Disable when uploading, vendor is fully verified, or document is approved
  const isDisabled = isUploading || user?.is_verified || status === "approved";
  const isPdf = fileUrl?.endsWith(".pdf");
  const isImage = !!fileUrl && !isPdf;

  const openPdf = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const openPreview = () => {
    if (!fileUrl) return;
    if (isPdf) {
      openPdf();
      return;
    }
    if (isImage) {
      setIsImagePreviewOpen(true);
    }
  };

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

          <div
            className="w-full flex-1 flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={openPreview}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openPreview();
            }}
          >
            {isPdf ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <FaFilePdf className="text-red-600" size={44} />
                <p className="text-center text-sm text-black font-semibold">PDF Uploaded</p>
              </div>
            ) : (
              <img
                src={fileUrl}
                className="max-w-full max-h-full object-contain rounded"
                alt="Uploaded file"
              />
            )}
          </div>

          <button
            className={`bg-black text-white mt-2 p-[5px] text-xs ${ isDisabled? "cursor-not-allowed" : ""} `}
            onClick={(e) => {
              e.stopPropagation();
              onUploadClick();
            }}
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

      {isImagePreviewOpen && fileUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setIsImagePreviewOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsImagePreviewOpen(false);
          }}
        >
          <div
            className="bg-white p-3 rounded-md max-w-[95vw] max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fileUrl}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}


export default UploadBox;