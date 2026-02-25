import React from "react";

interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
}

interface WorkHistory {
  title: string;
  company: string;
  period: string;
  location: string;
}

interface UserInfo {
  name: string;
  initials: string;
  passport: string;
  pin: string;
}

interface OfficialCVCardProps {
  user: UserInfo;
  education: Education;
  workHistory: WorkHistory[];
}

export function OfficialCVCard({ user, education, workHistory }: OfficialCVCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-verified-green"
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
          <span className="text-white font-semibold">State-Verified Data</span>
        </div>
        <div className="flex items-center gap-2 text-verified-green bg-verified-light/20 px-3 py-1 rounded-lg">
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-xs font-medium">Locked & Verified</span>
        </div>
      </div>
      <div className="p-6 space-y-5">
        <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
            {user.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
              <svg
                className="w-4 h-4 text-verified-green"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              Passport: {user.passport} • PIN: {user.pin}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Education (Verified)
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">
                  {education.institution}
                </p>
                <p className="text-sm text-slate-500">{education.degree}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {education.period} • GPA: {education.gpa}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-verified-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Official Work History
            </span>
          </div>
          <div className="space-y-3">
            {workHistory.map((work, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-4 border border-slate-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{work.title}</p>
                    <p className="text-sm text-slate-500">{work.company}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {work.period} • {work.location}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-verified-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
