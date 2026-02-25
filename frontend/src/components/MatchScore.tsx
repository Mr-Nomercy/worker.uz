import React from "react";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function MatchScore({ score, size = "md" }: MatchScoreProps) {
  const sizes = {
    sm: { svg: 48, circle: 20, stroke: 3, text: "text-xs" },
    md: { svg: 56, circle: 24, stroke: 4, text: "text-sm" },
    lg: { svg: 64, circle: 28, stroke: 4, text: "text-lg" },
  };

  const { svg, circle, stroke, text } = sizes[size];
  const radius = circle;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: svg, height: svg }}>
      <svg
        className="transform -rotate-90"
        width={svg}
        height={svg}
      >
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={radius}
          stroke="#10b981"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center font-bold text-verified-green ${text}`}
      >
        {score}%
      </span>
    </div>
  );
}
