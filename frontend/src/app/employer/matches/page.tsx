"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { CandidateCard } from "@/components/CandidateCard";
import { matchingApi, jobsApi } from "@/lib/api";

interface Candidate {
  id: string;
  profile?: {
    fullName: string;
    softSkills: string[];
  };
  matchScore: number;
}

interface Job {
  id: string;
  title: string;
}

export default function EmployerMatchesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchCandidates(selectedJob);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const response = await jobsApi.getAll({ limit: 20 });
      setJobs(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedJob(response.data.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const fetchCandidates = async (jobId: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await matchingApi.getCandidateMatches(jobId);
      setCandidates(response.data.data);
    } catch (err: any) {
      console.error("Failed to fetch candidates:", err);
      setError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = () => {
    const colors = ["primary", "purple", "amber"] as const;
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="employer" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="employer" />
        
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">AI Candidate Matches</h1>
            <select 
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
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
            <div className="grid grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  id={candidate.id}
                  name={candidate.profile?.fullName || "Unknown"}
                  initials={getInitials(candidate.profile?.fullName || "UN")}
                  role="Candidate"
                  location="Tashkent"
                  skills={candidate.profile?.softSkills || []}
                  matchScore={candidate.matchScore}
                  color={getRandomColor()}
                />
              ))}
            </div>
          )}

          {!loading && candidates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No candidates found</h3>
              <p className="text-slate-500">Try selecting a different job or post more vacancies</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
