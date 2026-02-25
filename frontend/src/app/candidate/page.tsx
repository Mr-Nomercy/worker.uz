"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { WelcomeSection } from "@/components/WelcomeSection";
import { OfficialCVCard } from "@/components/OfficialCVCard";
import { SoftSkillsSection } from "@/components/SoftSkillsSection";
import { JobCard } from "@/components/JobCard";
import { currentUser, userProfile, jobs } from "@/lib/mockData";

export default function CandidatePage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="candidate" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="candidate" user={currentUser} />
        <WelcomeSection name={currentUser.name} newJobsCount={jobs.length} />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
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
            {jobs.map((job) => (
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
            <button className="w-full py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors">
              View All {jobs.length}+ Jobs →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
