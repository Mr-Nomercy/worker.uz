"use client";

interface GovernmentLockedFieldProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

export function GovernmentLockedField({ label, value, icon }: GovernmentLockedFieldProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      {icon && (
        <div className="mt-1 text-slate-400">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-verified-green/10 rounded-full">
            <svg className="w-3 h-3 text-verified-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-verified-green">Verified</span>
          </div>
        </div>
        <div className="text-slate-800 font-medium">{value}</div>
      </div>
    </div>
  );
}

interface LockedSectionProps {
  title: string;
  children: React.ReactNode;
}

export function LockedSection({ title, children }: LockedSectionProps) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-1 text-verified-green">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Davlat tomonidan tasdiqlangan</span>
        </div>
      </div>
      <div className="p-4 bg-white">
        {children}
      </div>
    </div>
  );
}

interface ResyncButtonProps {
  onResync: () => void;
  isLoading?: boolean;
  lastSynced?: string;
}

export function ResyncButton({ onResync, isLoading, lastSynced }: ResyncButtonProps) {
  return (
    <button
      onClick={onResync}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Sinxronizatsiya qilinmoqda...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Davlat bazasi bilan sinxronlashtirish</span>
        </>
      )}
    </button>
  );
}
