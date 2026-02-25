"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { VacancyItem } from "@/components/JobCard";
import { VacancyModal } from "@/components/VacancyModal";
import { jobsApi } from "@/lib/api";
import { Toast } from "@/components/Toast";

interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  location: string;
  status: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export default function EmployerVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.getAll({ limit: 100 });
      setVacancies(response.data.data);
    } catch (err: any) {
      console.error("Failed to fetch vacancies:", err);
      setError("Failed to load vacancies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVacancy = async (newVacancy: {
    title: string;
    salary: string;
    description: string;
    requirements: string[];
    location: string;
  }) => {
    try {
      const [salaryMin, salaryMax] = newVacancy.salary.replace(/[^0-9-]/g, "").split("-").map(Number);
      
      await jobsApi.create({
        title: newVacancy.title,
        description: newVacancy.description,
        requirements: newVacancy.requirements,
        salaryMin: salaryMin || undefined,
        salaryMax: salaryMax || undefined,
        location: newVacancy.location,
      });
      
      setToast({ message: "Vacancy posted successfully!", type: "success" });
      setIsModalOpen(false);
      fetchVacancies();
    } catch (err: any) {
      setToast({ message: err.response?.data?.error || "Failed to post vacancy", type: "error" });
    }
  };

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return "Not specified";
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'UZS', maximumFractionDigits: 0 }).format(n);
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return fmt(max || 0);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Just now";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "OPEN": return "Active";
      case "CLOSED": return "Closed";
      case "DRAFT": return "Draft";
      default: return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="employer" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Toast
          message={toast?.message || ""}
          type={toast?.type || "success"}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
        
        <Header type="employer" />
        
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Manage Vacancies</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Official Vacancy
            </button>
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-4 space-y-3">
                {vacancies.map((vacancy) => (
                  <VacancyItem
                    key={vacancy.id}
                    title={vacancy.title}
                    postedDate={formatDate(vacancy.createdAt)}
                    status={getStatus(vacancy.status) as "Active" | "Paused" | "Closed"}
                    applicants={vacancy._count?.applications || 0}
                    salary={formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
                  />
                ))}
              </div>
            </div>
          )}

          {vacancies.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No vacancies yet</h3>
              <p className="text-slate-500 mb-4">Post your first job vacancy to start attracting candidates</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex px-4 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                Post First Vacancy
              </button>
            </div>
          )}
        </div>

        <VacancyModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddVacancy}
        />
      </main>
    </div>
  );
}
