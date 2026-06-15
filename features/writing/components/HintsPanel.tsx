"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Loader2 } from "lucide-react";
import HintsContent from "./HintsContent";
import HintsSkeleton from "./HintsSkeleton";
import type { Direction, HintsData } from "../types";

interface Props {
  collapsible?: boolean;
  direction: Direction;
  hints: HintsData | null;
  loading: boolean;
}

export default function HintsPanel({
  collapsible = false,
  direction,
  hints,
  loading,
}: Props) {
  const [open, setOpen] = useState(false);
  const isViToEn = direction === "vi_to_en";
  const showContent = !collapsible || open;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`flex items-center justify-between border-b border-indigo-100/60 bg-gradient-to-r from-indigo-50 to-purple-50/70 px-4 py-3 ${
          collapsible ? "cursor-pointer select-none" : ""
        }`}
        onClick={collapsible ? () => setOpen((value) => !value) : undefined}
        role={collapsible ? "button" : undefined}
        aria-expanded={collapsible ? open : undefined}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100">
            <Lightbulb className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {isViToEn ? "Gợi ý tiếng Anh" : "Gợi ý từ vựng"}
          </span>
          {loading && <Loader2 className="ml-1 h-3.5 w-3.5 animate-spin text-slate-400" aria-hidden="true" />}
        </div>
        {collapsible && (
          open
            ? <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
            : <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        )}
      </div>

      {showContent && (
        <div className="p-4">
          {loading
            ? <HintsSkeleton />
            : hints
              ? <HintsContent hints={hints} isViToEn={isViToEn} />
              : <p className="py-4 text-center text-xs text-slate-400">Chưa có gợi ý — hãy tải đoạn văn trước.</p>}
        </div>
      )}
    </div>
  );
}
