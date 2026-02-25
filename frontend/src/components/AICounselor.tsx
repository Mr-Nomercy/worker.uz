"use client";

import { useState } from "react";
import { matchingApi } from "@/lib/api";

interface ActionPlanItem {
  step: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface AIAdvice {
  compatibilityScore: number;
  analysis: string;
  strengths: string[];
  gaps: string[];
  actionPlan: ActionPlanItem[];
  language: string;
}

interface AICounselorProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export function AICounselor({ jobId, jobTitle, companyName }: AICounselorProps) {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"uz" | "ru">("uz");

  const fetchAdvice = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await matchingApi.getAIAdvice(jobId, language);
      setAdvice(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "AI is taking a break. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header with Sparkle Effect */}
      <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Career Coach</h3>
              <p className="text-white/80 text-sm">{jobTitle} @ {companyName}</p>
            </div>
          </div>
          
          {/* Language Toggle */}
          <div className="flex bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setLanguage("uz")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === "uz" ? "bg-white text-primary-600" : "text-white/80 hover:text-white"
              }`}
            >
              O'zbek
            </button>
            <button
              onClick={() => setLanguage("ru")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === "ru" ? "bg-white text-primary-600" : "text-white/80 hover:text-white"
              }`}
            >
              Русский
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!advice && !loading && !error && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">
              {language === "uz" ? "Karyeraingizni rejalashtiring" : "Планируйте свою карьеру"}
            </h4>
            <p className="text-slate-500 mb-6">
              {language === "uz" 
                ? "AI yordamida ushbu ishga mosligingizni baholang"
                : "Оцените свое соответствие этой работе с помощью ИИ"}
            </p>
            <button
              onClick={fetchAdvice}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {language === "uz" ? "AI Tahlilni olasizmi?" : "Получить анализ ИИ?"}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-slate-600 font-medium">
                  {language === "uz" ? "AI o'ylayapti..." : "ИИ думает..."}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAdvice}
              className="px-4 py-2 text-primary-600 font-medium hover:underline"
            >
              {language === "uz" ? "Qayta urinib ko'ring" : "Попробовать снова"}
            </button>
          </div>
        )}

        {/* Results */}
        {advice && !loading && !error && (
          <div className="space-y-6">
            {/* Compatibility Score */}
            <div className={`p-6 rounded-2xl ${getScoreBg(advice.compatibilityScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  {language === "uz" ? "Moslik balli" : "Оценка совместимости"}
                </span>
                <span className={`text-3xl font-bold ${getScoreColor(advice.compatibilityScore)}`}>
                  {advice.compatibilityScore}%
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    advice.compatibilityScore >= 80 ? "bg-verified-green" :
                    advice.compatibilityScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${advice.compatibilityScore}%` }}
                />
              </div>
            </div>

            {/* Analysis */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {language === "uz" ? "AI Tahlili" : "Анализ ИИ"}
              </h4>
              <p className="text-slate-700 leading-relaxed">{advice.analysis}</p>
            </div>

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-verified-light rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-verified-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-verified-green">
                    {language === "uz" ? "Kuchli tomonlar" : "Сильные стороны"}
                  </span>
                </div>
                <ul className="space-y-1">
                  {advice.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-700">• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-semibold text-red-600">
                    {language === "uz" ? "Rivojlantirish kerak" : "Что улучшить"}
                  </span>
                </div>
                <ul className="space-y-1">
                  {advice.gaps.map((g, i) => (
                    <li key={i} className="text-sm text-slate-700">• {g}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Plan */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {language === "uz" ? "Amal rejasi" : "План действий"}
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
                          {item.priority === "high" ? (language === "uz" ? "Muhim" : "Важно") :
                           item.priority === "medium" ? (language === "uz" ? "O'rtacha" : "Среднее") : 
                           (language === "uz" ? "Past" : "Низкое")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Get New Analysis */}
            <div className="text-center pt-4 border-t border-slate-100">
              <button
                onClick={fetchAdvice}
                className="text-primary-600 font-medium hover:underline text-sm"
              >
                {language === "uz" ? "Qayta tahlil qilish" : "Повторить анализ"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
