"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Header } from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="ml-64 flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
