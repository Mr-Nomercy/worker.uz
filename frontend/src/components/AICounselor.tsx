"use client";

import { matchingApi } from "@/lib/api";
import { DataPlaceholder } from "@/components/DataPlaceholder";
import { useState, useEffect } from "react";

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

// Smart Loading Messages
const loadingMessages = [
  "Profil tahlil qilinmoqda...",
  "Ko'nikmalar solishtirilmoqda...",
  "Ish talablari o'rganilmoqda...",
  "Maslahatlar tayyorlanmoqda...",
];

export function AICounselor({ jobId }: AICounselorProps) {
  const [data, setData] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await matchingApi.getAIAdvice(jobId, "uz");
        setData(response.data.data);
      } catch (err) {
        setError("AI maslahatlarini olishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchAdvice();
    }
  }, [jobId]);

  const advice: AIAdvice | null = data;

  // Cycle through loading messages
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setLoadingMessageIndex(0);
    }
  }, [loading]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-verified-green";
    if (score >= 60) return "text-yellow-600";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-verified-green to-emerald-400";
    if (score >= 60) return "from-yellow-500 to-amber-400";
    return "from-red-500 to-orange-400";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-700 border-red-200";
    if (priority === "medium") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getPriorityLabel = (priority: string) => {
    if (priority === "high") return "Muhim";
    if (priority === "medium") return "O'rtacha";
    return "Past";
  };

  // Calculate circle progress
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (advice?.matchScore || 0) / 100 * circumference;

  return (
    <div className="relative">
      {/* Magic Border Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 animate-pulse md:opacity-100" />
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header with Glow */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 overflow-hidden">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" />
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-1/3 w-2 h-2 bg-white/20 rounded-full animate-ping delay-100" />
          </div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Karyera Maslahatchi</h3>
                <p className="text-white/80 text-sm">Gemini 1.5 Flash</p>
              </div>
            </div>
            
            {/* Gemini Badge */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-white text-xs font-medium">Powered by Gemini</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading State with Smart Animation */}
          {loading && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8">
                {/* Circular Loading Animation */}
                <div className="relative w-24 h-24 mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="45" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                    <circle 
                      cx="48" cy="48" r="45" 
                      stroke="url(#gradient)" 
                      strokeWidth="4" 
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * 0.75}
                      className="animate-spin"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                
                {/* Cycling Text */}
                <p className="text-indigo-600 font-medium animate-pulse">
                  {loadingMessages[loadingMessageIndex]}
                </p>
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                ))}
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
              <p className="text-red-600 font-medium mb-2">AI xizmatida xatolik</p>
              <p className="text-slate-500 text-sm mb-4">
                {error || "AI hozirda band, iltimos 1 daqiqadan so'ng qayta urining."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Qayta urinish
              </button>
            </div>
          )}

          {/* Empty Profile */}
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

          {/* Results with Animated Circular Progress */}
          {advice && advice.actionPlan.length > 0 && (
            <div className="space-y-6">
              {/* Circular Progress Score */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="url(#scoreGradient)" 
                      strokeWidth="8" 
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={advice.matchScore >= 80 ? "#10b981" : advice.matchScore >= 60 ? "#eab308" : "#ef4444"} />
                        <stop offset="100%" stopColor={advice.matchScore >= 80 ? "#34d399" : advice.matchScore >= 60 ? "#facc15" : "#fb923c"} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(advice.matchScore)}`}>
                      {advice.matchScore}%
                    </span>
                    <span className="text-xs text-slate-500">Moslik</span>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                  AI Tahlili
                </h4>
                <p className="text-slate-700 leading-relaxed">{advice.analysis}</p>
              </div>

              {/* Missing Skills */}
              {advice.missingSkills.length > 0 && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
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
                      className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white bg-gradient-to-br ${getScoreGradient(item.priority === 'high' ? 80 : 50)}`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-semibold text-slate-800">{item.title}</h5>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)} border`}>
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
                  onClick={() => window.location.reload()}
                  className="text-indigo-600 font-medium hover:text-indigo-700 text-sm inline-flex items-center gap-2 transition-colors"
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
    </div>
  );
}

// AI Trigger Button Component
export function AIAnalyzeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-medium rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
      
      <div className="relative flex items-center gap-2">
        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI tahlilini olish
      </div>
    </button>
  );
}

// Floating AI Button
export function FloatingAIButton({ onClick, tip }: { onClick: () => void; tip: string }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Pulse Effect */}
      <span className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75" />
      
      {/* Button */}
      <div className="relative w-14 h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 w-64 p-3 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-sm text-slate-700 font-medium">Kun maslahati:</p>
        <p className="text-xs text-slate-500 mt-1">{tip}</p>
      </div>
    </button>
  );
}
