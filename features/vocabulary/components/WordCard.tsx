"use client";

import { useState } from "react";
import { ChevronRight, Volume2 } from "lucide-react";
import { POS_CONFIG } from "../constants";
import type { VocabularyEntry } from "../types";
import { speakWord } from "../utils";
import WordDetails from "./WordDetails";

interface Props {
  entry: VocabularyEntry;
  index: number;
}

export default function WordCard({ entry, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const pos = entry.partOfSpeech?.toLowerCase() ?? "";
  const config = POS_CONFIG[pos] ?? POS_CONFIG.default;

  return (
    <div
      className={`h-full opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
      style={{ animationFillMode: "forwards" }}
    >
      <article
        className={`group relative flex min-h-[188px] h-full cursor-pointer select-none flex-col overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
          expanded
            ? "border-slate-300 shadow-lg shadow-slate-200/60"
            : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50"
        }`}
        onClick={() => setExpanded((value) => !value)}
        aria-label={`Từ: ${entry.english}`}
      >
        <div className={`absolute inset-y-0 left-0 w-1 ${config.accent}`} aria-hidden="true" />
        <div className="flex items-start gap-3 px-4 pt-4">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold ${config.initial}`}>
            {entry.english.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <span className="break-words text-lg font-bold leading-tight text-slate-900">
              {entry.english}
            </span>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              {entry.phonetic && (
                <span className="font-mono text-xs text-slate-400">{entry.phonetic}</span>
              )}
              {entry.partOfSpeech && (
                <span className={`text-[11px] font-semibold uppercase ${config.label}`}>
                  {entry.partOfSpeech}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              speakWord(entry);
            }}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
            aria-label={`Nghe phát âm: ${entry.english}`}
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className={`mx-4 mt-4 rounded-lg border px-3.5 py-3 ${config.meaning}`}>
          <div className="mb-1 text-[10px] font-bold uppercase text-slate-400">Nghĩa tiếng Việt</div>
          <p className={`${entry.vietnamese ? "text-sm font-semibold text-slate-800" : "text-xs text-slate-500"} ${
            expanded ? "" : "line-clamp-2"
          } leading-snug`}>
            {entry.vietnamese || entry.definition || "Đang tải…"}
          </p>
        </div>

        {expanded && <WordDetails entry={entry} />}
        <div className="mt-auto flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 transition group-hover:text-slate-600">
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} aria-hidden="true" />
            {expanded ? "Thu gọn" : "Xem ví dụ"}
          </span>
          <span className="text-[10px] font-medium text-slate-300">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </article>
    </div>
  );
}
