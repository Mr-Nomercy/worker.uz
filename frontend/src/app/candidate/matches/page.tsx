"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { MatchScore } from "@/components/MatchScore";
import { currentUser, jobs } from "@/lib/mockData";

export default function CandidateMatchesPage() {
  const [matchFilter, setMatchFilter] = useState<number>(0);
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const [salaryFilter, setSalaryFilter] = useState<string>("All");

  const locations = ["All", ...Array.from(new Set(jobs.map(j => j.location)))];
  const salaryRanges = ["All", "$1,000-$2,000", "$2,000-$3,000", "$3,000+"];

  const filteredJobs = jobs.filter(job => {
    const match = job.matchScore >= matchFilter;
    const location = locationFilter === "All" || job.location === locationFilter;
    
    let salary = true;
    if (salaryFilter === "$1,000-$2,000") {
      const num = parseInt(job.salary.replace(/[^0-9]/g, ""));
      salary = num >= 1000 && num <= 2000;
    } else if (salaryFilter === "$2,000-$3,000") {
      const num = parseInt(job.salary.replace(/[^0-9]/g, ""));
      salary = num > 2000 && num <= 3000;
    } else if (salaryFilter === "$3,000+") {
      const num = parseInt(job.salary.replace(/[^0-9]/g, ""));
      salary = num > 3000;
    }
    
    return match && location && salary;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="candidate" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="candidate" user={currentUser} />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">AI Job Matches</h1>
          <p className="text-slate-500">Based on your verified profile, these jobs match your skills and experience</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Match:</span>
              <select 
                value={matchFilter}
                onChange={(e) => setMatchFilter(Number(e.target.value))}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={0}>All</option>
                <option value={80}>80%+ Match</option>
                <option value={90}>90%+ Match</option>
                <option value={95}>95%+ Match</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Location:</span>
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Salary:</span>
              <select 
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {salaryRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div className="ml-auto text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredJobs.length}</span> jobs
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
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
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your filters to see more results</p>
          </div>
        )}
      </main>
    </div>
  );
}
