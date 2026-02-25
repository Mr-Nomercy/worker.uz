"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { defaultAIConfig } from "@/lib/mockData";
import { Toast } from "@/components/Toast";

export default function AdminAIConfigPage() {
  const [config, setConfig] = useState(defaultAIConfig);
  const [isTesting, setIsTesting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saved, setSaved] = useState(false);

  const handleTestAI = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setToast({ message: "AI Engine test completed - System Stable!", type: "success" });
    }, 3000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const modelVersions = ["v2.4.1", "v2.4.0", "v2.3.9", "v2.3.8"];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">AI Engine Configuration</h1>
          <p className="text-slate-500">Manage AI matching algorithms and verification settings</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Match Sensitivity Slider */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Match Sensitivity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Adjust how precisely candidates are matched to jobs</span>
                <span className="text-lg font-bold text-primary-600">{config.matchSensitivity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.matchSensitivity}
                onChange={(e) => setConfig({ ...config, matchSensitivity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Flexible</span>
                <span>Strict</span>
              </div>
            </div>
          </div>

          {/* Min Match Score Slider */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Minimum Match Score</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Minimum score to show as recommended</span>
                <span className="text-lg font-bold text-primary-600">{config.minMatchScore}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.minMatchScore}
                onChange={(e) => setConfig({ ...config, minMatchScore: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Automated Verification Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Automated Verification</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Enable Auto-Verify</p>
                <p className="text-sm text-slate-500">Automatically verify candidates from government data</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, automatedVerification: !config.automatedVerification })}
                className={`relative w-14 h-7 rounded-full transition-colors ${config.automatedVerification ? "bg-primary-600" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${config.automatedVerification ? "translate-x-8" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* Model Version Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">AI Model Version</h2>
            <div className="space-y-3">
              {modelVersions.map((version) => (
                <button
                  key={version}
                  onClick={() => setConfig({ ...config, modelVersion: version })}
                  className={`w-full p-3 rounded-xl border-2 transition-colors flex items-center justify-between ${
                    config.modelVersion === version
                      ? "border-primary-500 bg-primary-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className={`font-medium ${config.modelVersion === version ? "text-primary-700" : "text-slate-700"}`}>
                    {version}
                  </span>
                  {config.modelVersion === version && (
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Max Candidates per Job */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Maximum Candidates per Job</h2>
            <div className="flex items-center gap-6">
              <input
                type="number"
                min="1"
                max="200"
                value={config.maxCandidatesPerJob}
                onChange={(e) => setConfig({ ...config, maxCandidatesPerJob: Number(e.target.value) })}
                className="w-32 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-500">candidates will be shown in AI recommendations</span>
            </div>
          </div>
        </div>

        {/* Test AI Engine Button */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Test AI Engine</h2>
              <p className="text-sm text-slate-500">Run a diagnostic test on the AI matching system</p>
            </div>
            <button
              onClick={handleTestAI}
              disabled={isTesting}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Testing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Diagnostic Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            {saved ? "Saved!" : "Save Configuration"}
          </button>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </div>
  );
}
