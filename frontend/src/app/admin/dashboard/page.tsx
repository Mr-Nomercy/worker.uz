"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface DashboardData {
  users: {
    total: number;
    candidates: number;
    verifiedCandidates: number;
    employers: number;
    verifiedEmployers: number;
    verificationRate: number;
  };
  jobs: {
    total: number;
    active: number;
  };
  applications: {
    total: number;
    accepted: number;
    rejected: number;
    pending: number;
    successRate: number;
  };
  companies: {
    verified: number;
    pending: number;
  };
  contactRequests: {
    total: number;
    accepted: number;
    rejected: number;
    pending: number;
    successRate: number;
  };
  topSkills: { skill: string; count: number }[];
  recentUsers: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    profile?: { fullName: string };
    company?: { name: string; isVerified: boolean };
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboard();
      setData(response.data.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 pt-16 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500">Platform statistics and analytics</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{data.users.total}</p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-slate-500">{data.users.candidates} Candidates</span>
            <span className="text-slate-500">{data.users.employers} Employers</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-verified-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">Verification Rate</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{data.users.verificationRate}%</p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-slate-500">{data.users.verifiedCandidates} Verified</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">Active Jobs</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{data.jobs.active}</p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-slate-500">of {data.jobs.total} total</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">Active Requests</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{data.contactRequests.pending}</p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-slate-500">{data.contactRequests.successRate}% success</span>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Skills (Verified Workers)</h3>
          {data.topSkills.length > 0 ? (
            <div className="space-y-3">
              {data.topSkills.map((item, index) => (
                <div key={item.skill} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-slate-700">{item.skill}</span>
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(item.count / data.topSkills[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-8">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No skill data available</p>
          )}
        </div>

        {/* Application Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-2xl font-bold text-slate-800">{data.applications.total}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-verified-green">{data.applications.accepted}</p>
              <p className="text-sm text-slate-500">Accepted</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-2xl font-bold text-red-600">{data.applications.rejected}</p>
              <p className="text-sm text-slate-500">Rejected</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-2xl font-bold text-amber-600">{data.applications.pending}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Success Rate</span>
              <span className="font-medium text-slate-700">{data.applications.successRate}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-verified-green rounded-full"
                style={{ width: `${data.applications.successRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Recent Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Verification</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">
                        {user.profile?.fullName || user.company?.name || "N/A"}
                      </p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'CANDIDATE' 
                        ? 'bg-blue-100 text-blue-700' 
                        : user.role === 'EMPLOYER'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="flex items-center gap-1 text-verified-green text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
