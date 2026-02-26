"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { OfficialCVCard } from "@/components/OfficialCVCard";
import { SoftSkillsSection } from "@/components/SoftSkillsSection";
import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton, ProfileCardSkeleton } from "@/components/Skeleton";
import { useProfile } from "@/hooks/useProfile";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/lib/AuthContext";

export default function CandidatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError, fetchProfile } = useProfile();
  const { jobs, isLoading: jobsLoading, error: jobsError, fetchJobs } = useJobs();

  useEffect(() => {
    fetchProfile();
    fetchJobs({ page: 1, limit: 10 });
  }, [fetchProfile, fetchJobs]);

  const userName = profile?.fullName || user?.profile?.fullName || user?.email?.split('@')[0] || 'Candidate';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="candidate" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16">
        <div className="max-w-7xl mx-auto">
          <Header type="candidate" onMenuClick={() => setSidebarOpen(true)} />
          <WelcomeSection name={userName} newJobsCount={jobs.length} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {profileError ? (
                <EmptyState 
                  title="Failed to load profile" 
                  message={profileError.message}
                  action={<button onClick={fetchProfile} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Retry</button>}
                />
              ) : profileLoading ? (
                <ProfileCardSkeleton />
              ) : profile ? (
                <OfficialCVCard 
                  user={{
                    name: profile.fullName || userName,
                    initials: (profile.fullName || 'U').slice(0, 2).toUpperCase(),
                    passport: '',
                    pin: '',
                  }} 
                  education={{ institution: '', degree: '', period: '', gpa: '' }} 
                  workHistory={[]} 
                />
              ) : (
                <EmptyState 
                  title="No Profile Data"
                  message="Your profile information is not available."
                />
              )}
              <SoftSkillsSection 
                skills={profile?.softSkills || []} 
                portfolioLinks={[]} 
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">AI Recommendations</h3>
                <span className="text-xs text-slate-500">Sorted by match</span>
              </div>
              {jobsError ? (
                <EmptyState 
                  title="Failed to load jobs" 
                  message={jobsError.message}
                  action={<button onClick={() => fetchJobs({ page: 1, limit: 10 })} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Retry</button>}
                />
              ) : jobsLoading ? (
                <>
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </>
              ) : jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id}
                      title={job.title}
                      company={job.company?.name || 'Company'}
                      salary={job.salaryMin ? `${job.salaryMin} - ${job.salaryMax || job.salaryMin}` : 'Negotiable'}
                      matchScore={85}
                      skills={job.requirements?.slice(0, 3) || []}
                    />
                  ))}
                </>
              ) : (
                <EmptyState 
                  title="No Jobs Available"
                  message="Check back later for new opportunities."
                />
              )}
              <button className="w-full py-3 min-h-[44px] text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors">
                View All {jobs.length}+ Jobs →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
      <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-4">{message}</p>
      {action}
    </div>
  );
}

function WelcomeSection({ name, newJobsCount }: { name: string; newJobsCount: number }) {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 mb-6 text-white">
      <h1 className="text-2xl font-bold mb-2">Welcome back, {name}!</h1>
      <p className="text-primary-100">
        {newJobsCount > 0 
          ? `You have ${newJobsCount} new job recommendations based on your profile.`
          : 'Update your profile to get job recommendations.'}
      </p>
    </div>
  );
}
