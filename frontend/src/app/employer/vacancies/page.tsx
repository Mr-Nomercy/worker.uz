"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { VacancyItem } from "@/components/JobCard";
import { VacancyModal } from "@/components/VacancyModal";
import { currentCompany, companyVacancies } from "@/lib/mockData";

export default function EmployerVacanciesPage() {
  const [vacancies, setVacancies] = useState(companyVacancies);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddVacancy = (newVacancy: {
    title: string;
    salary: string;
    description: string;
  }) => {
    const vacancy = {
      id: `vacancy-${Date.now()}`,
      title: newVacancy.title,
      postedDate: "Just now",
      status: "Active" as const,
      applicants: 0,
      salary: newVacancy.salary,
      description: newVacancy.description,
    };
    setVacancies([vacancy, ...vacancies]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="employer" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="employer" company={currentCompany} />
        
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

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-4 space-y-3">
              {vacancies.map((vacancy) => (
                <VacancyItem
                  key={vacancy.id}
                  title={vacancy.title}
                  postedDate={vacancy.postedDate}
                  status={vacancy.status}
                  applicants={vacancy.applicants}
                  salary={vacancy.salary}
                />
              ))}
            </div>
          </div>
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
