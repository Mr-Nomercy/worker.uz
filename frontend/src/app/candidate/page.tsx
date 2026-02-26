"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { WelcomeSection } from "@/components/WelcomeSection";
import { OfficialCVCard } from "@/components/OfficialCVCard";
import { SoftSkillsSection } from "@/components/SoftSkillsSection";
import { JobCard } from "@/components/JobCard";
import { JobCardSkeleton, ProfileCardSkeleton } from "@/components/Skeleton";
import { useMockData } from "@/lib/useDashboardData";
import { currentUser, userProfile, jobs } from "@/lib/mockData";

export default function CandidatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: profileData, isLoading: profileLoading } = useMockData({
    user: currentUser,
    profile: userProfile
  });

  const { data: jobsData, isLoading: jobsLoading } = useMockData(jobs);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="candidate" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-16">
        <div className="max-w-7xl mx-auto">
          <Header type="candidate" onMenuClick={() => setSidebarOpen(true)} />
          <WelcomeSection name={currentUser.name} newJobsCount={jobs.length} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {profileLoading ? (
                <ProfileCardSkeleton />
              ) : (
                <OfficialCVCard 
                  user={{
                    name: userProfile.fullName,
                    initials: currentUser.initials,
                    passport: userProfile.passport,
                    pin: userProfile.pin,
                  }} 
                  education={userProfile.education} 
                  workHistory={userProfile.workHistory} 
                />
              )}
              <SoftSkillsSection 
                skills={userProfile.softSkills.map(s => s.name)} 
                portfolioLinks={userProfile.portfolioLinks} 
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">AI Recommendations</h3>
                <span className="text-xs text-slate-500">Sorted by match</span>
              </div>
              {jobsLoading ? (
                <>
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </>
              ) : (
                <>
                  {jobsData?.map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id}
                      title={job.title}
                      company={job.company}
                      salary={job.salary}
                      matchScore={job.matchScore}
                      skills={job.skills}
                    />
                  ))}
                </>
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
