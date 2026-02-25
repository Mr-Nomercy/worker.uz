"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { CandidateCard } from "@/components/CandidateCard";
import { currentCompany, aiCandidates } from "@/lib/mockData";

export default function EmployerMatchesPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="employer" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="employer" company={currentCompany} />
        
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">AI Candidate Matches</h1>
          <div className="grid grid-cols-2 gap-4">
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
      </main>
    </div>
  );
}
