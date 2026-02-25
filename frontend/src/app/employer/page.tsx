"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MetricsCard } from "@/components/MetricsCard";
import { VacancyItem } from "@/components/JobCard";
import { CandidateCard } from "@/components/CandidateCard";
import { VacancyModal } from "@/components/VacancyModal";
import { currentCompany, companyVacancies, aiCandidates } from "@/lib/mockData";

export default function EmployerPage() {
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

  const activeVacancies = vacancies.filter(v => v.status === "Active").length;
  const totalApplicants = vacancies.reduce((sum, v) => sum + v.applicants, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="employer" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="employer" company={currentCompany} />
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <MetricsCard
            title="Active Vacancies"
            value={activeVacancies}
            color="primary"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <MetricsCard
            title="Total Applicants"
            value={totalApplicants}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <MetricsCard
            title="AI Recommended Profiles"
            value={aiCandidates.length}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Active Vacancies</h3>
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
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
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

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Top AI Candidates for You</h3>
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
              {aiCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  name={candidate.name}
                  initials={candidate.initials}
                  role={candidate.role}
                  location={candidate.location}
                  skills={candidate.skills}
                  matchScore={candidate.matchScore}
                  color={candidate.color}
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
