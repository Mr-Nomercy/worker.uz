"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { matchingApi } from "@/lib/api";
import { ErrorState, OfflineBanner } from "@/components/ErrorState";
import { DataPlaceholder } from "@/components/DataPlaceholder";
import { useOffline } from "@/components/OfflineProvider";
import { jobs as fallbackJobs } from "@/lib/mockData";

interface JobMatch {
  jobId: string;
  job?: {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    salaryMin: number;
    salaryMax: number;
    currency: string;
    location: string;
    company: {
      id: string;
      name: string;
      industry: string;
    };
  };
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export default function CandidateMatchesPage() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [matchFilter, setMatchFilter] = useState<number>(0);
  const [locationFilter, setLocationFilter] = useState<string>("All");
  const { isOffline } = useOffline();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await matchingApi.getJobMatches();
      setMatches(response.data.data);
    } catch (err: any) {
      console.error("Failed to fetch matches:", err);
      if (isOffline) {
        setMatches(fallbackJobs.map(j => ({
          jobId: j.id,
          job: {
            id: j.id,
            title: j.title,
            description: j.description,
            requirements: j.requirements,
            salaryMin: 0,
            salaryMax: 0,
            currency: "USD",
            location: j.location,
            company: {
              id: j.companyId,
              name: j.company,
              industry: "Technology",
            },
          },
          score: j.matchScore,
          matchedSkills: j.skills,
          missingSkills: [],
        })));
      } else {
        setError(err.message || "Failed to load job matches. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const locations = ["All", ...Array.from(new Set(matches.map(m => m.job?.location).filter(Boolean)))];

  const filteredMatches = matches.filter(match => {
    const scoreMatch = match.score >= matchFilter;
    const location = locationFilter === "All" || match.job?.location === locationFilter;
    return scoreMatch && location;
  });

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return "Not specified";
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'UZS', maximumFractionDigits: 0 }).format(n);
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
    return fmt(max || 0);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="candidate" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="candidate" />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">AI Job Matches</h1>
          <p className="text-slate-500">Based on your verified profile, these jobs match your skills and experience</p>
        </div>

        {isOffline && <OfflineBanner />}

        {error && !isOffline ? (
          <ErrorState 
            title="Unable to Load Jobs" 
            message={error}
            onRetry={fetchMatches}
            variant="default"
          />
        ) : loading ? (
          <DataPlaceholder rows={4} type="card" />
        ) : (
          <>
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

                <div className="ml-auto text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-800">{filteredMatches.length}</span> jobs
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredMatches.map((match) => (
                <JobCard
                  key={match.jobId}
                  id={match.jobId}
                  title={match.job?.title || "Unknown"}
                  company={match.job?.company?.name || "Unknown"}
                  salary={formatSalary(match.job?.salaryMin, match.job?.salaryMax, match.job?.currency)}
                  matchScore={match.score}
                  skills={match.matchedSkills}
                />
              ))}
            </div>

            {filteredMatches.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No jobs found</h3>
                <p className="text-slate-500">Try adjusting your filters to see more results</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
