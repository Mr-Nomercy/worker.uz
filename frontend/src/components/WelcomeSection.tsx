import React from "react";

interface WelcomeSectionProps {
  name: string;
  newJobsCount: number;
}

export function WelcomeSection({ name, newJobsCount }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Welcome back, {name}!
      </h1>
      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 px-5 py-3 rounded-xl">
        <svg
          className="w-5 h-5 text-primary-500 pulse-glow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="text-primary-700 font-medium">
          AI found{" "}
          <span className="text-primary-900 font-bold">{newJobsCount} new jobs</span>{" "}
          matching your official profile
        </span>
      </div>
    </div>
  );
}
