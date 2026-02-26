"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') {
        setIsChecking(false);
        return;
      }

      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        setIsChecking(false);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    };

    checkAuth();
  }, [pathname, router, allowedRoles]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
