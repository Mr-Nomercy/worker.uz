"use client";

import { AuthProvider } from "@/lib/AuthContext";
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
