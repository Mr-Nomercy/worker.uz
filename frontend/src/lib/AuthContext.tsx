"use client";

import { useAuth as useAuthFromHook, User, RegisterData } from "@/hooks/useAuth";

export { useAuthFromHook as useAuth, type User, type RegisterData };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
