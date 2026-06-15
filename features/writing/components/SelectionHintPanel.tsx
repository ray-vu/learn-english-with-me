import { Languages, X } from "lucide-react";
import type { HintsData } from "../types";

interface Props {
  error: string;
  result: HintsData | null;
  selectedText: string;
  onClose: () => void;
}

export default function SelectionHintPanel({
  error,
  result,
  selectedText,
  onClose,
}: Props) {
  return (
    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <Languages className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-indigo-900">Gợi ý cho đoạn đã chọn</div>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">&ldquo;{selectedText}&rdquo;</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700"
          aria-label="Đóng gợi ý"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-rose-600">{error}</p>
      ) : result ? (
        <div className="mt-3 space-y-3">
          {result.selection?.translation && (
            <div className="rounded-lg bg-white px-3 py-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Câu gợi ý</div>
              <p className="mt-1 text-sm font-medium text-slate-800">{result.selection.translation}</p>
            </div>
          )}
          {result.vocab.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.vocab.map((item) => (
                <span
                  key={item.word}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-white px-2.5 py-1.5 text-xs"
                >
                  <strong className="text-slate-800">{item.word}</strong>
                  <span className="text-slate-400">{item.translation}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
