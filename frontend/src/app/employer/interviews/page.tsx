"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { currentCompany, interviews } from "@/lib/mockData";
import { MatchScore } from "@/components/MatchScore";
import { Toast } from "@/components/Toast";
import { RescheduleModal } from "@/components/RescheduleModal";
import { ViewNotesModal } from "@/components/ViewNotesModal";

export default function EmployerInterviewsPage() {
  const [interviewList, setInterviewList] = useState(interviews);
  const [filter, setFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{ isOpen: boolean; interviewId: string | null }>({ isOpen: false, interviewId: null });
  const [viewNotesModal, setViewNotesModal] = useState<{ isOpen: boolean; interview: typeof interviews[0] | null }>({ isOpen: false, interview: null });

  const filteredInterviews = interviewList.filter(interview => {
    if (filter === "all") return true;
    return interview.status === filter;
  });

  const handleJoinCall = (interviewId: string) => {
    setToast({ message: "Connecting to secure video room...", type: "success" });
  };

  const handleReschedule = (interviewId: string) => {
    setRescheduleModal({ isOpen: true, interviewId });
  };

  const handleRescheduleSubmit = (data: { date: string; time: string; reason: string }) => {
    setInterviewList(interviewList.map(interview =>
      interview.id === rescheduleModal.interviewId
        ? { ...interview, dateTime: `${data.date}T${data.time}:00`, status: "scheduled" as const }
        : interview
    ));
    setRescheduleModal({ isOpen: false, interviewId: null });
    setToast({ message: "Interview rescheduled successfully!", type: "success" });
  };

  const handleCancel = (id: string) => {
    setInterviewList(interviewList.map(interview =>
      interview.id === id ? { ...interview, status: "cancelled" as const } : interview
    ));
    setToast({ message: "Interview cancelled", type: "info" });
  };

  const handleViewNotes = (interviewId: string) => {
    const interview = interviewList.find(i => i.id === interviewId);
    if (interview) {
      setViewNotesModal({ isOpen: true, interview });
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Scheduled</span>;
      case "completed":
        return <span className="px-3 py-1 bg-verified-light text-verified-green text-xs font-medium rounded-full">Completed</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case "phone":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "onsite":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const selectedInterview = interviewList.find(i => i.id === rescheduleModal.interviewId);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar type="employer" />
      <main className="ml-64 flex-1 p-8 pt-16">
        <Header type="employer" company={currentCompany} />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Interviews</h1>
          <p className="text-slate-500">Manage and schedule interviews with candidates</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "scheduled", "completed", "cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-primary-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === "scheduled" && ` (${interviewList.filter(i => i.status === "scheduled").length})`}
            </button>
          ))}
        </div>

        {/* Interview Cards */}
        <div className="space-y-4">
          {filteredInterviews.map((interview) => {
            const { date, time } = formatDateTime(interview.dateTime);
            return (
              <div
                key={interview.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 ${
                  interview.status === "cancelled"
                    ? "border-red-200 opacity-60"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Candidate Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {interview.candidateInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{interview.candidateName}</h3>
                        <MatchScore score={interview.matchScore} size="sm" />
                      </div>
                      <p className="text-sm text-slate-500">{interview.candidateRole}</p>
                    </div>
                  </div>

                  {/* Job */}
                  <div className="w-48">
                    <p className="text-sm text-slate-500">Applied for</p>
                    <p className="font-medium text-slate-800">{interview.jobTitle}</p>
                  </div>

                  {/* Date & Time */}
                  <div className="w-32">
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-medium text-slate-800">{date}</p>
                  </div>

                  <div className="w-24">
                    <p className="text-sm text-slate-500">Time</p>
                    <p className="font-medium text-slate-800">{time}</p>
                  </div>

                  {/* Type */}
                  <div className="w-24">
                    <p className="text-sm text-slate-500">Type</p>
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      {getTypeIcon(interview.type)}
                      <span className="capitalize">{interview.type}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-28">
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    {getStatusBadge(interview.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {interview.status === "scheduled" && (
                      <>
                        <button 
                          onClick={() => handleJoinCall(interview.id)}
                          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-xl font-medium hover:bg-primary-700 transition-colors"
                        >
                          Join Call
                        </button>
                        <button 
                          onClick={() => handleReschedule(interview.id)}
                          className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(interview.id)}
                          className="px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded-xl font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {interview.status === "completed" && (
                      <button 
                        onClick={() => handleViewNotes(interview.id)}
                        className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-xl font-medium hover:bg-slate-50 transition-colors"
                      >
                        View Notes
                      </button>
                    )}
                    {interview.status === "cancelled" && (
                      <button className="px-4 py-2 text-primary-600 text-sm hover:bg-primary-50 rounded-xl font-medium transition-colors">
                        Re-schedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInterviews.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No interviews found</h3>
            <p className="text-slate-500">
              {filter === "all" 
                ? "You don't have any scheduled interviews yet" 
                : `No ${filter} interviews`}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {interviewList.filter(i => i.status === "scheduled").length}
                </p>
                <p className="text-sm text-slate-500">Upcoming</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-verified-light rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-verified-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {interviewList.filter(i => i.status === "completed").length}
                </p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {Math.round((interviewList.filter(i => i.status === "completed").length / interviewList.length) * 100) || 0}%
                </p>
                <p className="text-sm text-slate-500">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reschedule Modal */}
        {selectedInterview && (
          <RescheduleModal
            isOpen={rescheduleModal.isOpen}
            onClose={() => setRescheduleModal({ isOpen: false, interviewId: null })}
            interview={{
              id: selectedInterview.id,
              candidateName: selectedInterview.candidateName,
              jobTitle: selectedInterview.jobTitle,
              currentDateTime: selectedInterview.dateTime,
            }}
            onSubmit={handleRescheduleSubmit}
          />
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={() => setToast(null)}
          />
        )}

        {/* View Notes Modal */}
        {viewNotesModal.interview && (
          <ViewNotesModal
            isOpen={viewNotesModal.isOpen}
            onClose={() => setViewNotesModal({ isOpen: false, interview: null })}
            interview={{
              candidateName: viewNotesModal.interview.candidateName,
              jobTitle: viewNotesModal.interview.jobTitle,
              dateTime: viewNotesModal.interview.dateTime,
            }}
          />
        )}
      </main>
    </div>
  );
}
