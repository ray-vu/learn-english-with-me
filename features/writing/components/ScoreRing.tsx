"use client";

import { useEffect, useState } from "react";

export default function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const offset = animated ? circumference - (score / 100) * circumference : circumference;

  return (
    <div className="relative inline-flex h-28 w-28 items-center justify-center">
      <svg width="112" height="112" className="-rotate-90" aria-hidden="true">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold leading-none text-slate-900">{score}</span>
        <span className="mt-0.5 text-[11px] text-slate-400">/100</span>
      </div>
    </div>
  );
}
