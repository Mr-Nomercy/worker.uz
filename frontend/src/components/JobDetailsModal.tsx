"use client";

import { useState } from "react";

interface JobDetailsModalProps {
  job: {
    id: string;
    title: string;
    company: string;
    salary: string;
    location: string;
    description: string;
    requirements: string[];
    skills: string[];
    matchScore: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    setApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{job.title}</h2>
              <p className="text-slate-300 mt-1">{job.company}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Salary</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{job.salary}</p>
              <p className="text-xs text-slate-400">per month</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{job.location}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">AI Match</p>
              <p className="text-lg font-bold text-verified-green mt-1">{job.matchScore}%</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Job Description</h3>
            <p className="text-slate-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Requirements</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-verified-green mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center gap-2 bg-verified-light border border-verified-green/30 px-4 py-3 rounded-xl">
            <svg className="w-5 h-5 text-verified-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-verified-green">This job posting is verified by My.Gov.uz</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            disabled={applied}
            className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
              applied
                ? "bg-verified-green text-white cursor-default"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {applied ? "Applied ✅" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
