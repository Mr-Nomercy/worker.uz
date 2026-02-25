"use client";

import { UserAuditLog } from "@/lib/mockData";

interface AuditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: UserAuditLog | null;
}

export function AuditDetailsModal({ isOpen, onClose, log }: AuditDetailsModalProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Audit Log Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">User ID</p>
              <p className="font-medium text-slate-800 mt-1">{log.userId}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Log ID</p>
              <p className="font-medium text-slate-800 mt-1">{log.id}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Action</p>
            <p className="font-medium text-slate-800 mt-1">{log.action}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">IP Address</p>
            <p className="font-medium text-slate-800 mt-1">{log.ipAddress}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Timestamp</p>
            <p className="font-medium text-slate-800 mt-1">{log.timestamp}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Details</p>
            <p className="text-sm text-slate-600 mt-1">{log.details}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
