"use client";

import { CompanyVerification } from "@/lib/mockData";

interface CompanyDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyVerification | null;
}

export function CompanyDocsModal({ isOpen, onClose, company }: CompanyDocsModalProps) {
  if (!isOpen || !company) return null;

  const getDocIcon = (doc: string) => (
    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Company Documents</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-500">Company Name</p>
          <p className="text-lg font-semibold text-slate-800">{company.name}</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Submitted Documents</p>
          {company.documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              {getDocIcon(doc)}
              <span className="text-sm font-medium text-slate-700">{doc}</span>
              <svg className="w-5 h-5 text-verified-green ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">Registration Date</p>
            <p className="font-medium text-slate-800">{company.registrationDate}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500">Tax ID (STIR)</p>
            <p className="font-medium text-slate-800">{company.taxId}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
