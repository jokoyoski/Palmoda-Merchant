"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-black font-semibold text-2xl">Something went wrong!</h2>

        <p className="mt-2 text-sm text-gray-600">
          {error?.message || "An unexpected error occurred."}
        </p>

        <div className="mt-6">
          <button
            className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>

        {error?.stack && (
          <pre className="mt-6 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto whitespace-pre-wrap">
            {error.stack}
          </pre>
        )}
      </div>
    </div>
  );
}
