"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { companyVerifications } from "@/lib/mockData";
import { CompanyDocsModal } from "@/components/CompanyDocsModal";
import { Toast } from "@/components/Toast";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState(companyVerifications);
  const [selectedCompany, setSelectedCompany] = useState<typeof companyVerifications[0] | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleApprove = (id: string) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: "approved" as const } : c));
    setToast({ message: "Company verified successfully!", type: "success" });
  };

  const handleReject = (id: string) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: "rejected" as const } : c));
    setToast({ message: "Company verification rejected", type: "error" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>;
      case "approved":
        return <span className="px-3 py-1 bg-verified-light text-verified-green text-xs font-medium rounded-full">Verified ✅</span>;
      case "rejected":
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Rejected</span>;
      default:
        return null;
    }
  };

  const pendingCount = companies.filter(c => c.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Company Verification</h1>
            <p className="text-slate-500">Review and verify company registrations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-sm font-medium">
              {pendingCount} Pending
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Registration Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax ID (STIR)</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{company.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{company.registrationDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-mono">{company.taxId}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(company.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View ({company.documents.length})
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {company.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(company.id)}
                            className="px-3 py-1.5 bg-verified-green text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(company.id)}
                            className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {company.status === "approved" && (
                        <span className="text-sm text-verified-green font-medium">Verified</span>
                      )}
                      {company.status === "rejected" && (
                        <span className="text-sm text-red-500 font-medium">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CompanyDocsModal
          isOpen={!!selectedCompany}
          onClose={() => setSelectedCompany(null)}
          company={selectedCompany}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </div>
  );
}
