"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { applicationsApi } from "@/lib/api";
import { Toast } from "@/components/Toast";

interface Application {
  id: string;
  jobId: string;
  job?: {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    company: {
      id: string;
      name: string;
      industry: string;
    };
  };
  status: string;
  matchScore?: number;
  appliedAt: string;
}

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsApi.getMyApplications();
      setApplications(response.data.data);
    } catch (err: any) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id: string) => {
    if (window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      try {
        await applicationsApi.withdraw(id);
        setApplications(applications.filter(app => app.id !== id));
        setToast({ message: "Application withdrawn successfully", type: "success" });
      } catch (err: any) {
        setToast({ message: err.response?.data?.error || "Failed to withdraw application", type: "error" });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Pending</span>;
      case "REVIEWING":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Reviewing</span>;
      case "INTERVIEW":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Interview Scheduled</span>;
      case "REJECTED":
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Rejected</span>;
      case "ACCEPTED":
        return <span className="px-3 py-1 bg-verified-light text-verified-green text-xs font-medium rounded-full">Accepted</span>;
      case "WITHDRAWN":
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">Withdrawn</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="candidate" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Toast
          message={toast?.message || ""}
          type={toast?.type || "success"}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
        
        <Header type="candidate" />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">My Applications</h1>
          <p className="text-slate-500">Track the status of your job applications</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Title</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Match Score</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Applied</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">{app.job?.title || "Unknown Job"}</p>
                          <p className="text-sm text-slate-500">{app.job?.company?.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600">{app.job?.company?.name || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        {app.matchScore ? (
                          <span className={`font-medium ${app.matchScore >= 80 ? 'text-verified-green' : app.matchScore >= 60 ? 'text-yellow-600' : 'text-slate-600'}`}>
                            {app.matchScore}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600">{formatDate(app.appliedAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.status === "PENDING" && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                          >
                            Withdraw
                          </button>
                        )}
                        {app.status === "INTERVIEW" && (
                          <span className="text-sm text-primary-600 font-medium">Check email for details</span>
                        )}
                        {app.status === "REJECTED" && (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                        {app.status === "ACCEPTED" && (
                          <span className="text-sm text-verified-green font-medium">Offer Received</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {applications.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No applications yet</h3>
            <p className="text-slate-500 mb-4">Start applying to jobs to see them here</p>
            <a href="/candidate/matches" className="inline-flex px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
              Browse Jobs
            </a>
          </div>
        )}

        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Application Tips</p>
              <p className="text-sm text-blue-600 mt-1">Keep your official CV updated and enable notifications to stay informed about your application status.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
