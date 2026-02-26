"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MetricsCard } from "@/components/MetricsCard";
import { VacancyItem } from "@/components/JobCard";
import { CandidateCard } from "@/components/CandidateCard";
import { VacancyModal } from "@/components/VacancyModal";
import { StatsCardSkeleton, CandidateCardSkeleton } from "@/components/Skeleton";
import { useJobs } from "@/hooks/useJobs";
import { useMatching } from "@/hooks/useMatching";
import { Job, CreateJobData } from "@/hooks/useJobs";

interface JobWithApplicants extends Job {
  applicants: number;
}

export default function EmployerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { 
    jobs, 
    isLoading: jobsLoading, 
    error: jobsError,
    fetchJobs, 
    createJob,
    clearError: clearJobsError 
  } = useJobs();

  const { 
    candidates, 
    isLoading: candidatesLoading,
    error: candidatesError,
    searchCandidates,
    clearError: clearCandidatesError 
  } = useMatching();

  useEffect(() => {
    fetchJobs({ limit: 50 });
    searchCandidates({ limit: 10 });
  }, [fetchJobs, searchCandidates]);

  useEffect(() => {
    if (jobsError) {
      setLocalError(jobsError.message);
    } else if (candidatesError) {
      setLocalError(candidatesError.message);
    }
  }, [jobsError, candidatesError]);

  const handleAddVacancy = async (newVacancy: {
    title: string;
    salary: string;
    description: string;
  }) => {
    try {
      const jobData: CreateJobData = {
        title: newVacancy.title,
        description: newVacancy.description,
        requirements: [],
        location: newVacancy.salary,
        salaryMin: parseInt(newVacancy.salary) || undefined,
        salaryMax: parseInt(newVacancy.salary) || undefined,
      };
      await createJob(jobData);
      setIsModalOpen(false);
    } catch (err) {
      setLocalError('Failed to create vacancy');
    }
  };

  const activeVacancies = jobs.filter(j => j.status === 'Active').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j as unknown as JobWithApplicants).applicants || 0, 0);

  const metricsLoading = jobsLoading;
  const displayCLoading = candidatesLoading;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="employer" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16">
        <div className="max-w-7xl mx-auto">
          <Header type="employer" onMenuClick={() => setSidebarOpen(true)} />
          
          {localError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {localError}
              <button 
                onClick={() => setLocalError(null)} 
                className="ml-2 text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {/* Metrics - responsive grid: 1 col on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            {metricsLoading ? (
              <>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
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
                  value={candidates.length}
                  color="green"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                />
              </>
            )}
          </div>

          {/* Content - responsive: 1 col on mobile, 2 cols on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 lg:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-semibold text-slate-800">Active Vacancies</h3>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Post New Official Vacancy</span>
                  <span className="sm:hidden">Post Vacancy</span>
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
                {jobsLoading ? (
                  <>
                    <div className="animate-pulse flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No vacancies yet</p>
                    <p className="text-sm mt-1">Post your first vacancy to get started</p>
                  </div>
                ) : (
                  jobs.map((vacancy) => (
                    <VacancyItem
                      key={vacancy.id}
                      title={vacancy.title}
                      postedDate={new Date(vacancy.createdAt).toLocaleDateString()}
                      status={vacancy.status as 'Active' | 'Paused' | 'Closed'}
                      applicants={0}
                      salary={vacancy.salaryMin && vacancy.salaryMax 
                        ? `${vacancy.salaryMin} - ${vacancy.salaryMax}` 
                        : vacancy.location}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 lg:px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Top AI Candidates for You</h3>
              </div>
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                {displayCLoading ? (
                  <>
                    <CandidateCardSkeleton />
                    <CandidateCardSkeleton />
                    <CandidateCardSkeleton />
                  </>
                ) : candidates.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No candidates found</p>
                    <p className="text-sm mt-1">Post vacancies to get AI-recommended candidates</p>
                  </div>
                ) : (
                  <>
                    {candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        id={candidate.id}
                        name={candidate.profile?.fullName || 'Unknown'}
                        initials={candidate.profile?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                        role={candidate.profile?.skills?.join(', ') || 'No skills listed'}
                        location={candidate.profile?.address || 'Location not specified'}
                        skills={candidate.profile?.skills || []}
                        matchScore={candidate.matchScore || 0}
                        color="purple"
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <VacancyModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddVacancy}
          />
        </div>
      </main>
    </div>
  );
}
