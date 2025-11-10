import "../styles/globals.css";
import type { Metadata } from "next";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar"; 

export const metadata: Metadata = {
  title: {
    default: "My Next App",
    template: "%s | My Next App",
  },
  description: "A simple Next.js application with a clean layout setup.",
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
      <body className="min-h-screen bg-white text-black">
        {/* Fixed Header */}
        <Header />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex pt-[50px]"> {/* Adjust top padding to header height */}
          <Sidebar />

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
