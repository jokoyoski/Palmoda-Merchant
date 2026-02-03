"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  href = "/",
  label = "Back to Dashboard",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link href={href}>
      <button
        className="bg-black text-white p-[5px] w-fit text-xs flex items-center"
        aria-label={label}
        title={label}
      >
        <ArrowLeft size={14} />
      </button>
    </Link>
  );
}
