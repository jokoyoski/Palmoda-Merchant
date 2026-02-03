import React from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import BackButton from "../_components/BackButton";

function page() {
  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-black font-semibold text-xl">Settings</h1>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default page;
