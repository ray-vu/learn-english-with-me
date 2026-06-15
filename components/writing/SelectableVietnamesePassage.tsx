"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Languages, Lightbulb, Loader2, X } from "lucide-react";
import type { HintsData } from "@/app/api/writing/hints/route";

interface SelectionAction {
  text: string;
  left: number;
  top: number;
}

export default function SelectableVietnamesePassage({ text }: { text: string }) {
  const passageRef = useRef<HTMLParagraphElement>(null);
  const [selection, setSelection] = useState<SelectionAction | null>(null);
  const [result, setResult] = useState<HintsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const captureSelection = useCallback(() => {
    const nativeSelection = window.getSelection();
    const container = passageRef.current;
    if (!nativeSelection || nativeSelection.isCollapsed || !container || nativeSelection.rangeCount === 0) return;

    const range = nativeSelection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return;

    const selectedText = nativeSelection.toString().replace(/\s+/g, " ").trim();
    if (selectedText.length < 2) return;

    const rect = range.getBoundingClientRect();
    const buttonWidth = 104;
    setSelection({
      text: selectedText.slice(0, 300),
      left: Math.min(window.innerWidth - buttonWidth - 12, Math.max(12, rect.left + rect.width / 2 - buttonWidth / 2)),
      top: Math.min(window.innerHeight - 52, rect.bottom + 8),
    });
    setResult(null);
    setError("");
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      window.setTimeout(captureSelection, 80);
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [captureSelection]);

  const loadSelectionHint = async () => {
    if (!selection) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/writing/hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selection.text,
          direction: "vi_to_en",
          mode: "selection",
        }),
      });
      if (!response.ok) throw new Error("selection_hint_error");
      setResult(await response.json());
      window.getSelection()?.removeAllRanges();
    } catch {
      setError("Không thể tải gợi ý lúc này.");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setSelection(null);
    setResult(null);
    setError("");
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div>
      <p
        ref={passageRef}
        className="text-base text-slate-800 leading-relaxed selection:bg-indigo-200 selection:text-slate-950"
        lang="vi"
      >
        {text}
      </p>

      {selection && !result && !error && (
        <button
          type="button"
          onClick={loadSelectionHint}
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

      {(result || error) && (
        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              <Languages className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-indigo-900">Gợi ý cho đoạn đã chọn</div>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">&ldquo;{selection?.text}&rdquo;</p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
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
      )}
    </div>
  );
}
