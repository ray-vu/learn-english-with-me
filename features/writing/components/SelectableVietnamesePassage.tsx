"use client";

import { Lightbulb, Loader2 } from "lucide-react";
import SelectionHintPanel from "./SelectionHintPanel";
import { useVietnameseSelection } from "../hooks/useVietnameseSelection";

export default function SelectableVietnamesePassage({ text }: { text: string }) {
  const {
    close,
    error,
    loadHint,
    loading,
    passageRef,
    result,
    selection,
  } = useVietnameseSelection();

  return (
    <div>
      <p
        ref={passageRef}
        className="text-base leading-relaxed text-slate-800 selection:bg-indigo-200 selection:text-slate-950"
        lang="vi"
      >
        {text}
      </p>

      {selection && !result && !error && (
        <button
          onClick={loadHint}
          disabled={loading}
          className="fixed z-[60] flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white shadow-lg transition hover:bg-slate-700 disabled:opacity-70"
          style={{ left: selection.left, top: selection.top }}
          aria-label="Gợi ý tiếng Anh cho đoạn đã chọn"
        >
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            : <Lightbulb className="h-4 w-4 text-amber-300" aria-hidden="true" />}
          Gợi ý
        </button>
      )}

      {selection && (result || error) && (
        <SelectionHintPanel
          error={error}
          result={result}
          selectedText={selection.text}
          onClose={close}
        />
      )}
    </div>
  );
}
