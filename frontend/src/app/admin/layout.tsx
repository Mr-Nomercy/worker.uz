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
        <main className="flex-1">
          <Header type="admin" />
          <div className="p-8 pt-20">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
