"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Toast } from "@/components/Toast";

const hiringTrends = [
  { month: "Sep", placements: 45 },
  { month: "Oct", placements: 62 },
  { month: "Nov", placements: 58 },
  { month: "Dec", placements: 71 },
  { month: "Jan", placements: 89 },
  { month: "Feb", placements: 94 },
];

const sectorDistribution = [
  { sector: "Information Technology", percentage: 78, candidates: 1247 },
  { sector: "Finance & Banking", percentage: 65, candidates: 892 },
  { sector: "Healthcare & Medicine", percentage: 52, candidates: 734 },
  { sector: "Manufacturing", percentage: 41, candidates: 523 },
  { sector: "Education", percentage: 35, candidates: 412 },
];

const keyMetrics = [
  {
    label: "Average Salary",
    value: "$72,450",
    change: "+8.2%",
    trend: "up",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Application Success Rate",
    value: "34.7%",
    change: "+5.1%",
    trend: "up",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "AI Engine Accuracy",
    value: "91.3%",
    change: "+2.4%",
    trend: "up",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function SystemReportsPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const handleExport = (format: "PDF" | "CSV") => {
    setToast({ message: "Generating report...", type: "info" });
    setTimeout(() => {
      setToast({ message: `${format} download successful`, type: "success" });
    }, 1500);
  };

  const maxPlacements = Math.max(...hiringTrends.map((d) => d.placements));

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <Toast
          message={toast?.message || ""}
          type={toast?.type || "success"}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
          <p className="text-slate-600 mt-1">Analytics and insights across the Worker platform</p>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => handleExport("PDF")}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to PDF
          </button>
          <button
            onClick={() => handleExport("CSV")}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to CSV
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {keyMetrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  {metric.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <span className="text-verified-green text-sm font-medium">{metric.change}</span>
                <span className="text-slate-500 text-sm">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Hiring Trends</h2>
            <p className="text-sm text-slate-500 mb-6">Job placements over the last 6 months</p>
            <div className="flex items-end justify-between h-64 gap-4">
              {hiringTrends.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">{data.placements}</span>
                  <div
                    className="w-full bg-primary-600 rounded-t-lg transition-all hover:bg-primary-700"
                    style={{ height: `${(data.placements / maxPlacements) * 100}%`, minHeight: "20px" }}
                  />
                  <span className="text-xs font-medium text-slate-500">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Sector Distribution</h2>
            <p className="text-sm text-slate-500 mb-6">Active industries by candidate count</p>
            <div className="space-y-5">
              {sectorDistribution.map((sector) => (
                <div key={sector.sector}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{sector.sector}</span>
                    <span className="text-sm text-slate-500">{sector.candidates.toLocaleString()} candidates</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                      style={{ width: `${sector.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Platform Summary</h2>
          <p className="text-sm text-slate-500 mb-6">Last updated: February 25, 2026</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500">Total Candidates</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">12,847</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500">Active Employers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">1,293</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500">Open Vacancies</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">4,562</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">2,147</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
