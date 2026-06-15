"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HintsData } from "../types";

export interface SelectionAction {
  text: string;
  left: number;
  top: number;
}

export function useVietnameseSelection() {
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
    const text = nativeSelection.toString().replace(/\s+/g, " ").trim();
    if (text.length < 2) return;

    const rect = range.getBoundingClientRect();
    const buttonWidth = 104;
    setSelection({
      text: text.slice(0, 300),
      left: Math.min(window.innerWidth - buttonWidth - 12, Math.max(12, rect.left + rect.width / 2 - buttonWidth / 2)),
      top: Math.min(window.innerHeight - 52, rect.bottom + 8),
    });
    setResult(null);
    setError("");
  }, []);

  useEffect(() => {
    const handleChange = () => window.setTimeout(captureSelection, 80);
    document.addEventListener("selectionchange", handleChange);
    return () => document.removeEventListener("selectionchange", handleChange);
  }, [captureSelection]);

  const loadHint = useCallback(async () => {
    if (!selection) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/writing/hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selection.text, direction: "vi_to_en", mode: "selection" }),
      });
      if (!response.ok) throw new Error("selection_hint_error");
      setResult(await response.json());
      window.getSelection()?.removeAllRanges();
    } catch {
      setError("Không thể tải gợi ý lúc này.");
    } finally {
      setLoading(false);
    }
  }, [selection]);

  const close = useCallback(() => {
    setSelection(null);
    setResult(null);
    setError("");
    window.getSelection()?.removeAllRanges();
  }, []);

  return { close, error, loadHint, loading, passageRef, result, selection };
}
