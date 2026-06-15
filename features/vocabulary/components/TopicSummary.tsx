import { Loader2, RefreshCw } from "lucide-react";
import type { Topic } from "../types";

interface Props {
  isLoadingWords: boolean;
  isReloading: boolean;
  topic: Topic;
  total: number;
  wordListTotal: number | null;
  onReload: () => void;
}

export default function TopicSummary({
  isLoadingWords,
  isReloading,
  topic,
  total,
  wordListTotal,
  onReload,
}: Props) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm animate-fade-in sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${topic.gradient} shadow-sm`}>
          <span className="text-base" role="img" aria-hidden="true">{topic.icon}</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-800">{topic.title}</div>
          <div className="text-xs text-slate-400" aria-live="polite">
            {total}/{wordListTotal ?? total} từ
            {isLoadingWords && <Loader2 className="ml-1 inline h-3 w-3 animate-spin text-indigo-400" aria-hidden="true" />}
          </div>
        </div>
      </div>
      <button
        onClick={onReload}
        disabled={isLoadingWords}
        className="flex h-9 flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Xáo trộn lại danh sách từ"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isReloading ? "animate-spin" : ""}`} aria-hidden="true" />
        Random lại
      </button>
    </div>
  );
}
