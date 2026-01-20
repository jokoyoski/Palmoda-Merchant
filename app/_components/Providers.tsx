// app/_components/Providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider } from "@heroui/system";
import { AuthProvider } from "../_lib/AuthContext";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push}>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
