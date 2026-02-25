"use client";

import { AuthProvider } from "./login/page";
import { OfflineProvider } from "@/components/OfflineProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OfflineProvider>
        {children}
      </OfflineProvider>
    </AuthProvider>
  );
}
