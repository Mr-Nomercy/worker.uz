"use client";

import { matchingApi } from "@/lib/api";
import { DataPlaceholder } from "@/components/DataPlaceholder";

interface ActionPlanItem {
  step: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface AIAdvice {
  matchScore: number;
  analysis: string;
  missingSkills: string[];
  actionPlan: ActionPlanItem[];
  candidate: { name: string };
  job: { title: string; company: string };
  hasApplied: boolean;
}

interface AICounselorProps {
  jobId: string;
}

export function AICounselor({ jobId }: AICounselorProps) {
  const { data, loading, error, refetch } = matchingApi.getAIAdvice(jobId, "uz");
  
  const advice: AIAdvice | null = data?.data?.data || null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-verified-green";
    if (score >= 60) return "text-yellow-600";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-verified-light";
    if (score >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-700";
    if (priority === "medium") return "bg-yellow-100 text-yellow-700";
    return "bg-slate-100 text-slate-700";
  };

  const getPriorityLabel = (priority: string) => {
    if (priority === "high") return "Muhim";
    if (priority === "medium") return "O'rtacha";
    return "Past";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Karyera Maslahatchi</h3>
              <p className="text-white/80 text-sm">Gemini 1.5 Flash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Loading State - Skeleton */}
        {loading && (
          <div className="space-y-4">
            <DataPlaceholder type="card" rows={1} />
            <div className="space-y-3">
              <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">
              {error?.message || "AI xizmatida xatolik yuz berdi"}
            </p>
            <p className="text-slate-500 text-sm mb-4">
              AI hozirda band, iltimos 1 daqiqadan so'ng qayta urining.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {/* Empty Profile State */}
        {!loading && !error && advice && advice.actionPlan.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">Iltimos, profilingizni to'ldiring</p>
            <p className="text-slate-500 text-sm">Ko'nikmalar bo'lmagan holda AI tahlil qila olmaydi</p>
          </div>
        )}

        {/* Results */}
        {advice && advice.actionPlan.length > 0 && (
          <div className="space-y-6">
            {/* Match Score Progress Bar */}
            <div className={`p-6 rounded-2xl ${getScoreBg(advice.matchScore)}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Moslik balli</span>
                <span className={`text-3xl font-bold ${getScoreColor(advice.matchScore)}`}>
                  {advice.matchScore}%
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    advice.matchScore >= 80 ? "bg-verified-green" :
                    advice.matchScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${advice.matchScore}%` }}
                />
              </div>
            </div>

            {/* Analysis */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                AI Tahlili
              </h4>
              <p className="text-slate-700 leading-relaxed">{advice.analysis}</p>
            </div>

            {/* Missing Skills */}
            {advice.missingSkills.length > 0 && (
              <div className="p-4 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-semibold text-red-600">Rivojlantirish kerak</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {advice.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white text-red-600 text-sm rounded-full border border-red-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Amal Rejasi
              </h4>
              <div className="space-y-3">
                {advice.actionPlan.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 p-4 bg-slate-50 rounded-xl"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getPriorityColor(item.priority)}`}>
                      <span className="font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-slate-800">{item.title}</h5>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {getPriorityLabel(item.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center pt-4 border-t border-slate-100">
              <button
                onClick={() => refetch()}
                className="text-primary-600 font-medium hover:underline text-sm inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Qayta tahlil qilish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
