"use client";

import { useState } from "react";
import { MatchScore } from "./MatchScore";
import { ScheduleInterviewModal } from "./ScheduleInterviewModal";

interface CandidateCardProps {
  id: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  skills: string[];
  matchScore: number;
  jobTitle?: string;
  color?: "primary" | "purple" | "amber";
}

const colorGradients = {
  primary: "from-primary-400 to-primary-600",
  purple: "from-purple-400 to-purple-600",
  amber: "from-amber-400 to-orange-500",
};

export function CandidateCard({
  id,
  name,
  initials,
  role,
  location,
  skills,
  matchScore,
  jobTitle = "Full Stack Developer",
  color = "primary",
}: CandidateCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [invited, setInvited] = useState(false);

  const handleInvite = () => {
    setShowModal(true);
  };

  const handleSchedule = (data: { date: string; time: string; type: "video" | "phone" | "onsite" }) => {
    setInvited(true);
    setShowModal(false);
  };

  return (
    <>
      <div className="p-4 rounded-xl border border-slate-100 hover:border-verified-green/30 hover:shadow-sm transition-all">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorGradients[color]} flex items-center justify-center text-white font-semibold`}
          >
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-800">{name}</h4>
              <svg
                className="w-4 h-4 text-verified-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-500">
              {role} • {location}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <MatchScore score={matchScore} size="sm" />
            <span className="text-xs text-slate-400">Match</span>
          </div>
        </div>
        <button
          onClick={handleInvite}
          disabled={invited}
          className={`w-full mt-3 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            invited
              ? "bg-verified-green text-white cursor-default"
              : "bg-verified-green text-white hover:bg-green-600"
          }`}
        >
          {invited ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Invited ✅
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Invite to Interview
            </>
          )}
        </button>
      </div>

      <ScheduleInterviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        candidate={{ name, role }}
        jobTitle={jobTitle}
        onSubmit={handleSchedule}
      />
    </>
  );
}
