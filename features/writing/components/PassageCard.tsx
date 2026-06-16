import { BookOpen, ExternalLink, Loader2, RefreshCw, Star } from "lucide-react";
import SelectablePassage from "./SelectablePassage";
import type { Direction, PageState, PassageData } from "../types";

interface Props {
  canGenerate: boolean;
  direction: Direction;
  passage: PassageData | null;
  pageState: PageState;
  selectedTopic: string;
  onReset: () => void;
}

function PassageContent({ direction, passage }: {
  direction: Direction;
  passage: PassageData;
}) {
  if (direction === "vi_to_en" && passage.textVi) {
    return <SelectablePassage direction={direction} text={passage.textVi} />;
  }
  return <SelectablePassage direction={direction} text={passage.text} />;
}

export default function PassageCard({
  canGenerate, direction, passage, pageState, selectedTopic, onReset,
}: Props) {
  const loading = pageState === "loading";

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-labelledby="passage-title"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" aria-hidden="true" />
              <span className="text-sm text-slate-500">Đang tải đoạn văn…</span>
            </>
          ) : passage ? (
            <>
              <Star className="h-4 w-4 flex-shrink-0 text-amber-400" aria-hidden="true" />
              <h2 id="passage-title" className="truncate text-sm font-semibold text-slate-800">
                {passage.title}
              </h2>
              <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                ~{passage.wordCount} từ
              </span>
              {passage.source && (
                <a
                  href={passage.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-slate-400 transition hover:text-indigo-500"
                  aria-label="Xem bài gốc trên Wikipedia"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </>
          ) : null}
        </div>
        <button
          onClick={onReset}
          disabled={!canGenerate}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          Bài mới
        </button>
      </div>

      <div className="min-h-[100px] px-5 py-5" aria-live="polite">
        {loading ? (
          <div className="space-y-2.5 animate-pulse">
            {[1, 0.9, 0.95, 0.7].map((width, index) => (
              <div key={index} className="h-4 rounded bg-slate-100" style={{ width: `${width * 100}%` }} />
            ))}
          </div>
        ) : passage ? (
          <PassageContent direction={direction} passage={passage} />
        ) : (
          <div className="flex min-h-24 flex-col items-center justify-center text-center">
            <BookOpen className="mb-2 h-6 w-6 text-slate-300" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-500">
              {selectedTopic ? "Nhấn Tạo bài để bắt đầu" : "Chọn chủ đề trước khi tạo bài"}
            </p>
          </div>
        )}
      </div>

      {passage && (
        <div className="px-5 pb-4">
          <span className="inline-flex rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs text-slate-400">
            {direction === "vi_to_en" ? "🇻🇳 Tiếng Việt → 🇬🇧 Tiếng Anh" : "🇬🇧 Tiếng Anh → 🇻🇳 Tiếng Việt"}
          </span>
        </div>
      )}
    </section>
  );
}
