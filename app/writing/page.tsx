"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  PenLine, RefreshCw, Loader2, AlertCircle,
  Star, ExternalLink, ChevronDown, ChevronUp,
  BookOpen, CheckCircle, BarChart3, Lightbulb, SlidersHorizontal,
} from "lucide-react";
import type { PassageData, PassageLengthUnit } from "@/app/api/writing/passage/route";
import type { ScoreResult } from "@/app/api/writing/score/route";
import type { HintsData } from "@/app/api/writing/hints/route";

// ── Score ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, color }: { score: number; color: string }) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const offset = animated ? C - (score / 100) * C : C;

  return (
    <div className="relative inline-flex items-center justify-center w-28 h-28">
      <svg width="112" height="112" className="-rotate-90" aria-hidden="true">
        <circle cx="56" cy="56" r={R} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="56" cy="56" r={R}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 leading-none">{score}</span>
        <span className="text-[11px] text-slate-400 mt-0.5">/100</span>
      </div>
    </div>
  );
}

// ── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 120);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-800">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Score card ────────────────────────────────────────────────────────────────

function ScoreCard({
  result, onReset, direction,
}: {
  result: ScoreResult;
  onReset: () => void;
  direction: Direction;
}) {
  const [showRef, setShowRef] = useState(false);

  const barColor = (s: number) =>
    s >= 75 ? "#10b981" : s >= 50 ? "#3b82f6" : s >= 35 ? "#f59e0b" : "#ef4444";

  const gradeEmoji =
    result.total >= 88 ? "🌟" : result.total >= 75 ? "👍" : result.total >= 60 ? "📝" : result.total >= 45 ? "💪" : "📚";

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in-up"
      aria-label="Kết quả chấm điểm"
    >
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <BarChart3 className="h-4 w-4 text-indigo-500" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800">Kết quả chấm điểm</span>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <ScoreRing score={result.total} color={result.gradeColor} />
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <span className="text-2xl font-bold" style={{ color: result.gradeColor }}>
                {result.grade}
              </span>
              <span className="text-xl">{gradeEmoji}</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              {result.total >= 75
                ? "Tuyệt vời! Bạn đã nắm bắt ý nghĩa của đoạn văn rất tốt."
                : result.total >= 55
                ? "Cố gắng tốt! Hãy so sánh với bản dịch tham khảo để cải thiện thêm."
                : "Đừng nản lòng — luyện tập thêm sẽ giúp bạn tiến bộ nhanh!"}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {result.hasReference && (
            <ScoreBar
              label="Độ chính xác từ vựng"
              score={result.scores.similarity}
              color={barColor(result.scores.similarity)}
            />
          )}
          <ScoreBar
            label="Độ đầy đủ nội dung"
            score={result.scores.length}
            color={barColor(result.scores.length)}
          />
          <ScoreBar
            label="Ngữ pháp & chính tả"
            score={result.scores.grammar}
            color={barColor(result.scores.grammar)}
          />
        </div>

        {result.feedback.length > 0 && (
          <ul className="space-y-1.5 mb-5" role="list">
            {result.feedback.map((msg, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {msg}
              </li>
            ))}
          </ul>
        )}

        {result.hasReference && result.reference && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowRef((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
              aria-expanded={showRef}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                {direction === "vi_to_en" ? "Bản gốc tiếng Anh" : "Bản dịch tham khảo"}
              </div>
              {showRef
                ? <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
                : <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
              }
            </button>
            {showRef && (
              <div className="px-4 py-3 bg-white animate-fade-in">
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{result.reference}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  * Tham khảo từ MyMemory — không phải bản dịch chuẩn tuyệt đối
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 px-5 pb-5">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition-all shadow-sm"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Bài mới
        </button>
      </div>
    </section>
  );
}

// ── Hints panel ───────────────────────────────────────────────────────────────

function HintsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="h-2.5 w-28 bg-slate-100 rounded-full mb-3" />
        <div className="flex flex-wrap gap-2">
          {[72, 88, 64, 80, 76, 68].map((w, i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-100" style={{ width: `${w}px` }} />
          ))}
        </div>
      </div>
      <div>
        <div className="h-2.5 w-32 bg-slate-100 rounded-full mb-3" />
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

function HintsContent({ hints, isViToEn }: { hints: HintsData; isViToEn: boolean }) {
  return (
    <div className="space-y-5">
      {/* Vocabulary chips */}
      {hints.vocab.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            {isViToEn ? "Từ vựng có thể dùng" : "Từ quan trọng"}
          </p>
          <div className="flex flex-wrap gap-2">
            {hints.vocab.map((v, i) => (
              <div
                key={i}
                className="flex flex-col items-start rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-default"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-sm font-semibold text-slate-800 leading-tight">{v.word}</span>
                {v.translation && (
                  <span className="text-[11px] text-indigo-500 mt-0.5 leading-tight">{v.translation}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key phrases */}
      {hints.phrases.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            {isViToEn ? "Cấu trúc tham khảo" : "Cụm từ gợi ý"}
          </p>
          <div className="space-y-2">
            {hints.phrases.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-3.5 py-2.5"
              >
                <p className="text-[13px] font-medium text-slate-700 leading-snug">
                  &ldquo;{p.phrase}&rdquo;
                </p>
                {p.translation && (
                  <p className="text-[11px] text-indigo-500 mt-1 leading-snug">{p.translation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HintsPanel({
  hints,
  loading,
  direction,
  collapsible = false,
}: {
  hints: HintsData | null;
  loading: boolean;
  direction: Direction;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isViToEn = direction === "vi_to_en";
  const showContent = !collapsible || open;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50/70 border-b border-indigo-100/60 ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={collapsible ? () => setOpen((v) => !v) : undefined}
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
          {loading && <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin ml-1" aria-hidden="true" />}
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
            : (
              <p className="text-xs text-slate-400 text-center py-4">
                Chưa có gợi ý — hãy tải đoạn văn trước.
              </p>
            )
          }
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type PageState = "loading" | "ready" | "scoring" | "scored" | "error";
type Direction = "en_to_vi" | "vi_to_en";

const DIRECTION_TABS: { value: Direction; label: string; hint: string; flag: string }[] = [
  { value: "en_to_vi", label: "Anh → Việt", hint: "Đọc tiếng Anh, dịch sang tiếng Việt", flag: "🇬🇧→🇻🇳" },
  { value: "vi_to_en", label: "Việt → Anh", hint: "Đọc tiếng Việt, dịch sang tiếng Anh", flag: "🇻🇳→🇬🇧" },
];

const LENGTH_LIMITS: Record<PassageLengthUnit, { min: number; max: number; step: number }> = {
  chars: { min: 180, max: 1200, step: 20 },
  lines: { min: 2, max: 8, step: 1 },
};

function clampLength(value: number, unit: PassageLengthUnit, direction: Direction): number {
  const limits = LENGTH_LIMITS[unit];
  const max = unit === "chars" && direction === "vi_to_en" ? 420 : limits.max;
  return Math.min(max, Math.max(limits.min, Math.round(value)));
}

export default function WritingPage() {
  const [passage, setPassage] = useState<PassageData | null>(null);
  const [direction, setDirection] = useState<Direction>("en_to_vi");
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [userText, setUserText] = useState("");
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [hints, setHints] = useState<HintsData | null>(null);
  const [hintsLoading, setHintsLoading] = useState(false);
  const [lengthUnit, setLengthUnit] = useState<PassageLengthUnit>("chars");
  const [lengthValue, setLengthValue] = useState(700);
  const initialLoadRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  const loadHints = useCallback(async (text: string, dir: Direction) => {
    setHintsLoading(true);
    setHints(null);
    try {
      const res = await fetch("/api/writing/hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, direction: dir }),
      });
      if (res.ok) setHints(await res.json());
    } catch { /* hints are non-critical */ } finally {
      setHintsLoading(false);
    }
  }, []);

  const loadPassage = useCallback(async (dir: Direction) => {
    setPageState("loading");
    setScoreResult(null);
    setUserText("");
    setErrorMsg("");
    setHints(null);
    setHintsLoading(false);
    try {
      const safeLengthValue = clampLength(lengthValue, lengthUnit, dir);
      const params = new URLSearchParams({
        direction: dir,
        lengthUnit,
        lengthValue: String(safeLengthValue),
      });
      const res = await fetch(`/api/writing/passage?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch_error");
      const data: PassageData = await res.json();
      setPassage(data);
      setPageState("ready");
      // Load hints in background without blocking passage display
      loadHints(data.text, dir);
    } catch {
      setErrorMsg("Không thể tải đoạn văn. Vui lòng thử lại.");
      setPageState("error");
    }
  }, [lengthUnit, lengthValue, loadHints]);

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    loadPassage("en_to_vi");
  }, [loadPassage]);

  const handleDirectionChange = useCallback((dir: Direction) => {
    setDirection(dir);
    setLengthValue((value) => clampLength(value, lengthUnit, dir));
    loadPassage(dir);
  }, [lengthUnit, loadPassage]);

  const handleScore = useCallback(async () => {
    if (!passage || userText.trim().split(/\s+/).length < 5) return;
    setPageState("scoring");
    try {
      const body =
        direction === "vi_to_en"
          ? { text: passage.textVi || passage.text, translation: userText, direction, referenceEn: passage.text }
          : { text: passage.text, translation: userText, direction };
      const res = await fetch("/api/writing/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("score_error");
      const data: ScoreResult = await res.json();
      setScoreResult(data);
      setPageState("scored");
      setTimeout(() => scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setErrorMsg("Không thể chấm điểm. Vui lòng thử lại.");
      setPageState("ready");
    }
  }, [passage, userText, direction]);

  const handleReset = useCallback(() => {
    loadPassage(direction);
  }, [loadPassage, direction]);

  const handleLengthUnitChange = useCallback((unit: PassageLengthUnit) => {
    setLengthUnit(unit);
    setLengthValue((value) => clampLength(value, unit, direction));
  }, [direction]);

  const handleLengthBlur = useCallback(() => {
    setLengthValue((value) => clampLength(value, lengthUnit, direction));
  }, [direction, lengthUnit]);

  const wordCount = userText.trim() ? userText.trim().split(/\s+/).length : 0;
  const canScore = wordCount >= 5 && pageState === "ready";
  const isScoring = pageState === "scoring";
  const activeLengthLimits = LENGTH_LIMITS[lengthUnit];
  const activeLengthMax = lengthUnit === "chars" && direction === "vi_to_en" ? 420 : activeLengthLimits.max;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <PenLine className="h-4 w-4" aria-hidden="true" />
          <span>Luyện viết</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Luyện dịch thuật</h1>
        <p className="text-slate-500 text-sm mt-1">
          {DIRECTION_TABS.find((t) => t.value === direction)?.hint} — AI sẽ chấm điểm bản dịch của bạn
        </p>
      </div>

      {/* Direction tabs */}
      <div
        className="flex gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 mb-6"
        role="tablist"
        aria-label="Chiều dịch"
      >
        {DIRECTION_TABS.map((tab) => {
          const active = direction === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={active}
              onClick={() => !active && handleDirectionChange(tab.value)}
              disabled={pageState === "loading" || pageState === "scoring"}
              className={`
                flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                ${active
                  ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              <span aria-hidden="true">{tab.flag}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 sm:w-36">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
              <SlidersHorizontal className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Độ dài bài</div>
              <div className="text-xs text-slate-400">Cho bài mới</div>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-[1fr_auto] gap-2 sm:grid-cols-[minmax(120px,160px)_minmax(116px,140px)_auto]">
            <label className="min-w-0">
              <span className="sr-only">Đơn vị độ dài</span>
              <select
                value={lengthUnit}
                onChange={(e) => handleLengthUnitChange(e.target.value as PassageLengthUnit)}
                disabled={pageState === "loading" || pageState === "scoring"}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                aria-label="Đơn vị độ dài bài dịch"
              >
                <option value="chars">Ký tự</option>
                <option value="lines">Dòng</option>
              </select>
            </label>

            <label className="min-w-0">
              <span className="sr-only">Giá trị độ dài</span>
              <input
                type="number"
                value={lengthValue}
                min={activeLengthLimits.min}
                max={activeLengthMax}
                step={activeLengthLimits.step}
                onChange={(e) => setLengthValue(Number(e.target.value))}
                onBlur={handleLengthBlur}
                disabled={pageState === "loading" || pageState === "scoring"}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                aria-label="Độ dài bài dịch"
              />
            </label>

            <button
              onClick={handleReset}
              disabled={pageState === "loading" || pageState === "scoring"}
              className="col-span-2 flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-1"
            >
              <RefreshCw className={`h-4 w-4 ${pageState === "loading" ? "animate-spin" : ""}`} aria-hidden="true" />
              Tạo bài
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {lengthUnit === "lines"
            ? "Mỗi dòng tương ứng một câu nội dung; số dòng hiển thị thực tế còn phụ thuộc kích thước màn hình."
            : `Giới hạn hiện tại: ${activeLengthLimits.min}-${activeLengthMax} ký tự.`}
        </p>
      </div>

      {/* Two-column layout on desktop */}
      <div className="lg:grid lg:grid-cols-[1fr_268px] lg:gap-6 lg:items-start">

        {/* ── Left / main column ── */}
        <div className="space-y-5">
          {/* Error banner */}
          {pageState === "error" && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in" role="alert">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="flex-1">{errorMsg}</span>
              <button onClick={() => loadPassage(direction)} className="font-medium underline hover:no-underline flex-shrink-0">
                Thử lại
              </button>
            </div>
          )}

          {/* Passage card */}
          <section
            className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            aria-labelledby="passage-title"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2 min-w-0">
                {pageState === "loading" ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" aria-hidden="true" />
                    <span className="text-sm text-slate-500">Đang tải đoạn văn…</span>
                  </div>
                ) : passage ? (
                  <>
                    <Star className="h-4 w-4 text-amber-400 flex-shrink-0" aria-hidden="true" />
                    <h2 id="passage-title" className="text-sm font-semibold text-slate-800 truncate">
                      {passage.title}
                    </h2>
                    <span className="flex-shrink-0 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      ~{passage.wordCount} từ
                    </span>
                    {passage.source && (
                      <a
                        href={passage.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-slate-400 hover:text-indigo-500 transition-colors"
                        aria-label="Xem bài gốc trên Wikipedia"
                        title="Wikipedia"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </>
                ) : null}
              </div>
              <button
                onClick={handleReset}
                disabled={isScoring || pageState === "loading"}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Tải đoạn văn mới"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${pageState === "loading" ? "animate-spin" : ""}`} aria-hidden="true" />
                Bài mới
              </button>
            </div>

            <div className="px-5 py-5 min-h-[100px]" aria-live="polite">
              {pageState === "loading" ? (
                <div className="space-y-2.5 animate-pulse">
                  {[1, 0.9, 0.95, 0.7].map((w, i) => (
                    <div key={i} className="h-4 rounded bg-slate-100" style={{ width: `${w * 100}%` }} />
                  ))}
                </div>
              ) : passage ? (
                direction === "vi_to_en" && passage.textVi ? (
                  <p className="text-base text-slate-800 leading-relaxed" lang="vi">
                    {passage.textVi}
                  </p>
                ) : (
                  <p className="text-base text-slate-800 leading-relaxed" lang="en">
                    {passage.text}
                  </p>
                )
              ) : null}
            </div>

            {passage && (
              <div className="px-5 pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
                  {direction === "vi_to_en" ? "🇻🇳 Tiếng Việt → 🇬🇧 Tiếng Anh" : "🇬🇧 Tiếng Anh → 🇻🇳 Tiếng Việt"}
                </span>
              </div>
            )}
          </section>

          {/* Mobile hints (collapsed by default) */}
          {(hints || hintsLoading) && (
            <div className="lg:hidden">
              <HintsPanel hints={hints} loading={hintsLoading} direction={direction} collapsible />
            </div>
          )}

          {/* Writing area */}
          <section aria-labelledby="writing-heading">
            <div className="flex items-center justify-between mb-2">
              <h2 id="writing-heading" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <PenLine className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                Bản dịch của bạn
              </h2>
              <div className="flex items-center gap-3">
                {wordCount > 0 && (
                  <span className="text-xs text-slate-400" aria-live="polite">
                    {wordCount} từ
                  </span>
                )}
                {(pageState === "ready" || pageState === "scored") && userText && (
                  <button
                    onClick={() => { setUserText(""); setScoreResult(null); setPageState("ready"); textareaRef.current?.focus(); }}
                    className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label="Xóa nội dung"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              disabled={pageState === "loading" || isScoring || pageState === "scored"}
              placeholder={direction === "vi_to_en" ? "Write your English translation here…" : "Viết bản dịch tiếng Việt của bạn tại đây…"}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm resize-none transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 leading-relaxed disabled:bg-slate-50 disabled:cursor-not-allowed"
              rows={7}
              lang={direction === "vi_to_en" ? "en" : "vi"}
              aria-label={direction === "vi_to_en" ? "Enter English translation" : "Nhập bản dịch tiếng Việt"}
            />
          </section>

          {/* Action buttons */}
          {pageState !== "scored" && (
            <div className="flex gap-3">
              <button
                onClick={handleScore}
                disabled={!canScore || isScoring}
                className="
                  flex-1 flex items-center justify-center gap-2 rounded-xl px-5 py-3
                  text-sm font-semibold transition-all duration-200 shadow-sm
                  bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                  hover:from-indigo-500 hover:to-purple-500 hover:shadow-md hover:shadow-indigo-200
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
                "
                aria-label="Chấm điểm bản dịch"
              >
                {isScoring ? (
                  <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Đang chấm…</>
                ) : (
                  <><BarChart3 className="h-4 w-4" aria-hidden="true" /> Chấm điểm</>
                )}
              </button>
            </div>
          )}

          {/* Score card */}
          {pageState === "scored" && scoreResult && (
            <div ref={scoreRef}>
              <ScoreCard result={scoreResult} onReset={handleReset} direction={direction} />
            </div>
          )}
        </div>

        {/* ── Right / hints sidebar (desktop only) ── */}
        <aside className="hidden lg:block lg:sticky lg:top-20">
          <HintsPanel hints={hints} loading={hintsLoading} direction={direction} />
        </aside>

      </div>
    </div>
  );
}
