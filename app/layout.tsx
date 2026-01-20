// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";
import AppShell from "./_components/AppShell";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Providers from "./_components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Palmoda Merchant",
    template: "%s | Scale Your Business on Palmoda",
  },
  description:
    "Join thousands of top sellers to list, manage, and sell your products to a wider audience.",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen  text-black" suppressHydrationWarning>
       <Providers>
          <AppShell>{children}</AppShell>
       </Providers>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
