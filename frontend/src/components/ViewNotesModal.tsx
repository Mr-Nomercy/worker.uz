"use client";

import { useState } from "react";

interface ViewNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: {
    candidateName: string;
    jobTitle: string;
    dateTime: string;
    notes?: string;
  };
}

const mockNotes = [
  { id: 1, author: "HR Manager", date: "2024-01-24", content: "Excellent technical skills demonstrated during the screening call. Strong communication skills." },
  { id: 2, author: "Technical Lead", date: "2024-01-25", content: "Deep understanding of system design principles. Recommended for next round." },
];

export function ViewNotesModal({ isOpen, onClose, interview }: ViewNotesModalProps) {
  const [notes] = useState(mockNotes);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Interview Notes</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Interview Info */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <p className="font-semibold text-slate-800">{interview.candidateName}</p>
          <p className="text-sm text-slate-500">{interview.jobTitle}</p>
          <p className="text-sm text-slate-400 mt-1">{formatDate(interview.dateTime)}</p>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-800">Interview Feedback</h3>
          {notes.map((note) => (
            <div key={note.id} className="border-l-2 border-primary-300 pl-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">{note.author}</span>
                <span className="text-xs text-slate-400">{note.date}</span>
              </div>
              <p className="text-sm text-slate-600">{note.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
