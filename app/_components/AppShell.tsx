"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../_lib/AuthContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const isPublicRoute =
    pathname?.includes("/login") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/forgot-password");

  useEffect(() => {
    if (!isPublicRoute && !loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isPublicRoute, loading, isAuthenticated, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Checking session...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex pt-[50px] h-[calc(100vh-50px)]">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto relative z-0">{children}</main>
      </div>
    </>
  );
}
