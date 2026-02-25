"use client";

import { useState } from "react";
import { MatchScore } from "./MatchScore";
import { JobDetailsModal } from "./JobDetailsModal";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  salary: string;
  location?: string;
  matchScore: number;
  skills: string[];
  description?: string;
  requirements?: string[];
}

export function JobCard({
  id,
  title,
  company,
  salary,
  location = "Tashkent",
  matchScore,
  skills,
  description = "We are looking for an experienced professional to join our team.",
  requirements = ["Relevant experience", "Good communication skills"],
}: JobCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setApplied(true);
  };

  const job = {
    id,
    title,
    company,
    salary,
    location,
    description,
    requirements,
    skills,
    matchScore,
  };

  return (
    <>
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
            <p className="text-sm text-slate-500">{company}</p>
          </div>
          <MatchScore score={matchScore} size="md" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-800">{salary}</span>
          <span className="text-xs text-slate-400">per month</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="w-full mt-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
        >
          View Details
        </button>
      </div>

      <JobDetailsModal
        job={job}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

interface VacancyItemProps {
  title: string;
  postedDate: string;
  status: "Active" | "Paused" | "Closed";
  applicants: number;
  salary: string;
}

export function VacancyItem({
  title,
  postedDate,
  status,
  applicants,
  salary,
}: VacancyItemProps) {
  const isActive = status === "Active";

  return (
    <div className="p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-slate-800">{title}</h4>
          <p className="text-sm text-slate-500">Posted {postedDate}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-lg ${
            isActive
              ? "bg-verified-light text-verified-green"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span>{applicants} applicants</span>
        <span>•</span>
        <span>{salary}/mo</span>
      </div>
    </div>
  );
}
