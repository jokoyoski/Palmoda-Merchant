"use client";
import React from "react";
import { FaFileUpload } from "react-icons/fa";


function UploadBox({
  title,
  fileUrl,
  onUploadClick,
  inputRef,
  onFileChange,
}: {
  title: string;
  fileUrl: string;
  onUploadClick: () => void;
  inputRef: any;
  onFileChange: (e: any) => void;
}) {
  const isPdf = fileUrl?.endsWith(".pdf");

  return (
    <div className="flex flex-col gap-1 w-full md:w-[230px]">
      <h1 className="text-black font-semibold text-xs">{title}</h1>

      {/* If file uploaded → show preview */}
      {fileUrl ? (
        <div className="border-2 border-gray-300 p-2 rounded-md h-[180px] flex flex-col items-center justify-center bg-gray-50">
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
            className="bg-black text-white mt-2 p-[5px] text-xs"
            onClick={onUploadClick}
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