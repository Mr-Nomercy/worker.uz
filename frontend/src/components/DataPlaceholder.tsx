"use client";

interface DataPlaceholderProps {
  rows?: number;
  type?: "table" | "card" | "list";
}

export function DataPlaceholder({ rows = 5, type = "list" }: DataPlaceholderProps) {
  if (type === "table") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-slate-50 h-12 border-b border-slate-100" />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-16 border-b border-slate-50 flex items-center px-6 gap-4">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-6 w-24 bg-slate-200 rounded" />
              <div className="w-12 h-12 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-32 bg-slate-200 rounded" />
          </div>
          <div className="h-8 w-20 bg-slate-200 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function MetricPlaceholder() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          </div>
          <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ChartPlaceholder() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="h-6 w-32 bg-slate-200 rounded mb-4" />
      <div className="h-64 bg-slate-100 rounded-lg flex items-end justify-around p-4 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-slate-300 rounded-t-lg w-full animate-pulse"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}
