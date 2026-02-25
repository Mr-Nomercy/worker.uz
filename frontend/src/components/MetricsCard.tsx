import React from "react";

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "primary" | "blue" | "green";
}

const colorClasses = {
  primary: "bg-primary-50 text-primary-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-verified-light text-verified-green",
};

export function MetricsCard({
  title,
  value,
  icon,
  color = "primary",
}: MetricsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <span className="text-3xl font-bold text-slate-800">{value}</span>
      </div>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}
