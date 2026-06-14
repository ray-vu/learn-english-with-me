"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search, X, Volume2, ChevronRight, BookOpen,
  Lightbulb, AlertCircle, Loader2, RefreshCw,
  Tag, Zap, Sparkles, Wind, Hash, Layers,
} from "lucide-react";
import { topics, type Topic } from "@/lib/vocabulary-data";
import type { VocabularyEntry } from "@/app/api/vocabulary/[word]/route";
import type { CEFRLevel, TopicWordsResponse } from "@/app/api/vocabulary/topic/route";

// ── constants ─────────────────────────────────────────────────────────────────

const ALL_LEVELS: Array<CEFRLevel | "all"> = ["all", "A1", "A2", "B1", "B2", "C1", "C2"];

const LEVEL_STYLES: Record<CEFRLevel, { badge: string; dot: string }> = {
  A1: { badge: "bg-emerald-100 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  A2: { badge: "bg-teal-100 text-teal-700 ring-teal-200",         dot: "bg-teal-500" },
  B1: { badge: "bg-sky-100 text-sky-700 ring-sky-200",            dot: "bg-sky-500" },
  B2: { badge: "bg-indigo-100 text-indigo-700 ring-indigo-200",   dot: "bg-indigo-500" },
  C1: { badge: "bg-violet-100 text-violet-700 ring-violet-200",   dot: "bg-violet-500" },
  C2: { badge: "bg-rose-100 text-rose-700 ring-rose-200",         dot: "bg-rose-500" },
};

// POS icon + color config — used for the prefix icon on each card
type PosConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  iconBg: string;
  iconColor: string;
  badge: string;
};

const POS_CONFIG: Record<string, PosConfig> = {
  noun:      { icon: Tag,      iconBg: "bg-orange-100",  iconColor: "text-orange-500",  badge: "bg-orange-100 text-orange-700"  },
  verb:      { icon: Zap,      iconBg: "bg-violet-100",  iconColor: "text-violet-500",  badge: "bg-violet-100 text-violet-700"  },
  adjective: { icon: Sparkles, iconBg: "bg-pink-100",    iconColor: "text-pink-500",    badge: "bg-pink-100 text-pink-700"      },
  adverb:    { icon: Wind,     iconBg: "bg-cyan-100",    iconColor: "text-cyan-500",    badge: "bg-cyan-100 text-cyan-700"      },
  pronoun:   { icon: Hash,     iconBg: "bg-lime-100",    iconColor: "text-lime-600",    badge: "bg-lime-100 text-lime-700"      },
  default:   { icon: Layers,   iconBg: "bg-slate-100",   iconColor: "text-slate-500",   badge: "bg-slate-100 text-slate-600"    },
};

// ── helpers ───────────────────────────────────────────────────────────────────

function speak(entry: VocabularyEntry) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (entry.audio) {
    new Audio(entry.audio).play().catch(() => {
      const utt = new SpeechSynthesisUtterance(entry.english);
      utt.lang = "en-US"; utt.rate = 0.9;
      window.speechSynthesis.speak(utt);
    });
  } else {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(entry.english);
    utt.lang = "en-US"; utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }
}

async function fetchWordDetail(word: string): Promise<VocabularyEntry | null> {
  const res = await fetch(`/api/vocabulary/${encodeURIComponent(word)}`);
  if (!res.ok) return null;
  return res.json();
}

// ── sub-components ────────────────────────────────────────────────────────────

function CEFRBadge({ level }: { level: CEFRLevel }) {
  const s = LEVEL_STYLES[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {level}
    </span>
  );
}

function WordSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse h-full min-h-[140px]">
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div className="h-9 w-9 rounded-lg bg-slate-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="h-5 w-24 rounded bg-slate-200" />
            <div className="h-3.5 w-14 rounded bg-slate-100" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-4 w-14 rounded-full bg-slate-100" />
            <div className="h-4 w-8 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="h-7 w-7 rounded-lg bg-slate-100 flex-shrink-0" />
      </div>
      <div className="px-4 pb-3 pl-[64px] flex-1 space-y-1.5">
        <div className="h-3.5 w-full rounded bg-slate-100" />
        <div className="h-3.5 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
        <div className="h-3 w-20 rounded bg-slate-100" />
      </div>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="font-medium underline hover:no-underline flex-shrink-0">
          Thử lại
        </button>
      )}
    </div>
  );
}

function EmptyLevel({ level, onReset }: { level: CEFRLevel | "all"; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-center px-6 animate-fade-in">
      <div className="text-3xl mb-2" aria-hidden="true">🔍</div>
      <p className="text-slate-600 font-medium text-sm">Không có từ nào ở level {level}</p>
      <button onClick={onReset} className="mt-3 text-xs text-indigo-600 underline hover:no-underline">
        Xem tất cả level
      </button>
    </div>
  );
}

function WordCard({ entry, index, level }: { entry: VocabularyEntry; index: number; level?: CEFRLevel }) {
  const [expanded, setExpanded] = useState(false);
  const pos = entry.partOfSpeech?.toLowerCase() ?? "";
  const posConf = POS_CONFIG[pos] ?? POS_CONFIG.default;
  const PosIcon = posConf.icon;

  return (
    <div
      className={`animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 8)} h-full`}
      style={{ animationFillMode: "forwards" }}
    >
      <article
        className={`
          flex flex-col h-full rounded-xl border cursor-pointer overflow-hidden
          transition-all duration-200 select-none group
          ${expanded
            ? "border-slate-300 bg-white shadow-md shadow-slate-200/70"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm hover:shadow-slate-200/60"
          }
        `}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={`Từ: ${entry.english}`}
      >
        {/* ── Header: icon + word + phonetic + speaker ── */}
        <div className="flex items-start gap-3 px-4 pt-4 pb-3">
          {/* POS icon */}
          <div className={`flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center ${posConf.iconBg} transition-transform duration-200 group-hover:scale-105`}>
            <PosIcon className={`h-4 w-4 ${posConf.iconColor}`} aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Word + phonetic */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                {entry.english}
              </span>
              {entry.phonetic && (
                <span className="text-xs text-slate-400 font-mono">{entry.phonetic}</span>
              )}
            </div>
            {/* Badges */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {entry.partOfSpeech && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold leading-none ${posConf.badge}`}>
                  {entry.partOfSpeech}
                </span>
              )}
              {level && <CEFRBadge level={level} />}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); speak(entry); }}
            className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors mt-0.5"
            aria-label={`Nghe phát âm: ${entry.english}`}
            title="Nghe phát âm"
          >
            <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* ── Vietnamese meaning — capped 2 lines when collapsed ── */}
        <div className="px-4 pb-3 pl-[64px] flex-1">
          {entry.vietnamese ? (
            <p className={`text-sm font-semibold text-slate-800 leading-snug ${expanded ? "" : "line-clamp-2"}`}>
              {entry.vietnamese}
            </p>
          ) : entry.definition ? (
            <p className={`text-xs text-slate-500 leading-snug ${expanded ? "" : "line-clamp-2"}`}>
              {entry.definition}
            </p>
          ) : (
            <p className="text-xs text-slate-300 italic">Đang tải…</p>
          )}
        </div>

        {/* ── Expandable: English definition + example ── */}
        {expanded && (
          <div className="mx-4 mb-4 rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-2.5 animate-fade-in">
            {/* English definition */}
            {entry.definition && (
              <div className="flex gap-2 items-start">
                <BookOpen className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-slate-600 leading-relaxed">{entry.definition}</p>
              </div>
            )}
            {/* Example sentence */}
            {entry.example && (
              <div className="flex gap-2 items-start pt-2 border-t border-slate-200">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1 min-w-0">
                  <p className="text-xs text-slate-700 italic leading-relaxed">&ldquo;{entry.example}&rdquo;</p>
                  {entry.exampleVi && (
                    <p className="text-xs text-slate-400 leading-relaxed">{entry.exampleVi}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className={`flex items-center px-4 py-2.5 border-t mt-auto transition-colors
          ${expanded ? "border-slate-200 bg-slate-50" : "border-slate-100 bg-slate-50/50"}`}
        >
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ChevronRight className={`h-3 w-3 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`} aria-hidden="true" />
            {expanded ? "Thu gọn" : "Xem ví dụ"}
          </span>
        </div>
      </article>
    </div>
  );
}

function TopicButton({ topic, isActive, onClick }: { topic: Topic; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Chủ đề: ${topic.title} (${topic.titleVi})`}
      className={`
        w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-150 border
        ${isActive
          ? `bg-gradient-to-r ${topic.gradient} text-white border-transparent shadow-sm`
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
        }
      `}
    >
      <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">{topic.icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{topic.title}</div>
        <div className={`text-xs truncate ${isActive ? "text-white/80" : "text-slate-400"}`}>{topic.titleVi}</div>
      </div>
    </button>
  );
}

// ── state types ───────────────────────────────────────────────────────────────

type PanelState =
  | { mode: "idle" }
  | { mode: "loading-list" }
  | { mode: "loading-words"; words: VocabularyEntry[]; wordList: string[]; levelCounts: TopicWordsResponse["levelCounts"]; total: number }
  | { mode: "ready"; words: VocabularyEntry[]; levelCounts: TopicWordsResponse["levelCounts"]; total: number }
  | { mode: "empty-level"; levelCounts: TopicWordsResponse["levelCounts"] }
  | { mode: "error"; message: string };

// ── main page ─────────────────────────────────────────────────────────────────

export default function VocabularyPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | "all">("all");
  const [query, setQuery] = useState("");
  const [panelState, setPanelState] = useState<PanelState>({ mode: "idle" });
  const [isReloading, setIsReloading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── fetch topic word list → then fetch each word detail progressively ──

  const loadTopic = useCallback(async (topic: Topic, level: CEFRLevel | "all", isReload = false) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    if (isReload) {
      setIsReloading(true);
    } else {
      setPanelState({ mode: "loading-list" });
    }

    // Step 1: get word list from Datamuse-based topic API
    let topicData: TopicWordsResponse;
    try {
      const url = `/api/vocabulary/topic?name=${encodeURIComponent(topic.id)}${level !== "all" ? `&level=${level}` : ""}`;
      const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
      if (!res.ok) throw new Error("topic_fetch_error");
      topicData = await res.json();
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setPanelState({ mode: "error", message: "Không thể tải danh sách từ vựng. Vui lòng thử lại." });
      setIsReloading(false);
      return;
    }

    if (ctrl.signal.aborted) return;

    if (topicData.words.length === 0) {
      setPanelState({ mode: "empty-level", levelCounts: topicData.levelCounts });
      setIsReloading(false);
      return;
    }

    // Step 2: progressively fetch word details
    const wordList = topicData.words;
    const results: VocabularyEntry[] = [];

    setPanelState({
      mode: "loading-words",
      words: [],
      wordList,
      levelCounts: topicData.levelCounts,
      total: topicData.total,
    });
    setIsReloading(false);

    await Promise.all(
      wordList.map(async (word) => {
        try {
          const entry = await fetchWordDetail(word);
          if (ctrl.signal.aborted) return;
          if (entry) {
            results.push(entry);
            // Progressive update
            const ordered = wordList
              .map((w) => results.find((r) => r.english.toLowerCase() === w.toLowerCase()))
              .filter((e): e is VocabularyEntry => !!e);
            setPanelState({
              mode: "loading-words",
              words: ordered,
              wordList,
              levelCounts: topicData.levelCounts,
              total: topicData.total,
            });
          }
        } catch {
          // non-fatal per-word failure
        }
      })
    );

    if (ctrl.signal.aborted) return;

    const finalOrdered = wordList
      .map((w) => results.find((r) => r.english.toLowerCase() === w.toLowerCase()))
      .filter((e): e is VocabularyEntry => !!e);

    if (finalOrdered.length === 0) {
      setPanelState({ mode: "error", message: "Không thể tải chi tiết từ vựng. Vui lòng thử lại." });
    } else {
      setPanelState({
        mode: "ready",
        words: finalOrdered,
        levelCounts: topicData.levelCounts,
        total: topicData.total,
      });
    }
  }, []);

  // ── search single word ──

  const searchWord = useCallback(async (word: string) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setPanelState({ mode: "loading-list" });

    try {
      const entry = await fetchWordDetail(word);
      if (ctrl.signal.aborted) return;
      if (entry) {
        setPanelState({ mode: "ready", words: [entry], levelCounts: { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }, total: 1 });
      } else {
        setPanelState({ mode: "error", message: `Không tìm thấy từ "${word}"` });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setPanelState({ mode: "error", message: "Lỗi kết nối. Vui lòng thử lại." });
      }
    }
  }, []);

  // ── event handlers ──

  const handleTopicSelect = useCallback((topic: Topic) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setQuery("");
    setSelectedTopic((prev) => {
      if (prev?.id === topic.id) {
        setPanelState({ mode: "idle" });
        return null;
      }
      loadTopic(topic, selectedLevel);
      return topic;
    });
  }, [loadTopic, selectedLevel]);

  const handleLevelChange = useCallback((level: CEFRLevel | "all") => {
    setSelectedLevel(level);
    if (selectedTopic) {
      loadTopic(selectedTopic, level);
    }
  }, [selectedTopic, loadTopic]);

  const handleReload = useCallback(() => {
    if (!selectedTopic) return;
    loadTopic(selectedTopic, selectedLevel, true);
  }, [selectedTopic, selectedLevel, loadTopic]);

  const handleSearchInput = useCallback((val: string) => {
    setQuery(val);
    setSelectedTopic(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    const trimmed = val.trim();
    if (!trimmed) { setPanelState({ mode: "idle" }); return; }
    if (trimmed.length < 2) return;
    searchTimeoutRef.current = setTimeout(() => searchWord(trimmed), 500);
  }, [searchWord]);

  const clearSearch = useCallback(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    abortRef.current?.abort();
    setQuery("");
    setPanelState({ mode: "idle" });
    inputRef.current?.focus();
  }, []);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  }, []);

  // ── derived state ──

  const isLoadingList = panelState.mode === "loading-list";
  const isLoadingWords = panelState.mode === "loading-words";
  const words =
    panelState.mode === "ready" || panelState.mode === "loading-words"
      ? panelState.words
      : [];
  const wordList =
    panelState.mode === "loading-words" ? panelState.wordList : null;
  const levelCounts =
    panelState.mode === "ready" || panelState.mode === "loading-words" || panelState.mode === "empty-level"
      ? panelState.levelCounts
      : null;
  const totalAvailable =
    panelState.mode === "ready" || panelState.mode === "loading-words"
      ? panelState.total
      : 0;
  const skeletonCount = wordList ? wordList.length - words.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>Học từ vựng</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Từ vựng theo chủ đề</h1>
        <p className="text-slate-500 text-sm mt-1">
          Chọn chủ đề, lọc theo trình độ CEFR, hoặc tra bất kỳ từ nào
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left panel ── */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
          {/* Search */}
          <div className="relative">
            {isLoadingList && query ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400 animate-spin pointer-events-none" aria-hidden="true" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
            )}
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Tra từ bất kỳ… (vd: resilient)"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              aria-label="Tra từ vựng"
              autoComplete="off"
              spellCheck="false"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Topic list */}
          <nav aria-label="Chủ đề từ vựng">
            <ul className="space-y-1.5" role="list">
              {topics.map((topic) => (
                <li key={topic.id}>
                  <TopicButton
                    topic={topic}
                    isActive={selectedTopic?.id === topic.id}
                    onClick={() => handleTopicSelect(topic)}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 min-w-0">

          {/* ── Level filter + reload header ── */}
          {selectedTopic && (
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">
              {/* Topic label */}
              <div className="flex items-center gap-2 mr-auto">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${selectedTopic.gradient} shadow-sm flex-shrink-0`}>
                  <span className="text-base" role="img" aria-hidden="true">{selectedTopic.icon}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-800">{selectedTopic.title}</span>
                  {(panelState.mode === "ready" || panelState.mode === "loading-words") && (
                    <span className="ml-2 text-xs text-slate-400" aria-live="polite">
                      {words.length}/{wordList ? wordList.length : words.length} từ
                      {isLoadingWords && <Loader2 className="inline ml-1 h-3 w-3 text-indigo-400 animate-spin" aria-hidden="true" />}
                    </span>
                  )}
                </div>
              </div>

              {/* Level filter buttons */}
              <div className="flex items-center gap-1 flex-wrap" role="group" aria-label="Lọc theo cấp độ CEFR">
                {ALL_LEVELS.map((lvl) => {
                  const isActive = selectedLevel === lvl;
                  const count = lvl !== "all" && levelCounts ? levelCounts[lvl as CEFRLevel] : null;
                  return (
                    <button
                      key={lvl}
                      onClick={() => handleLevelChange(lvl as CEFRLevel | "all")}
                      aria-pressed={isActive}
                      disabled={isLoadingList}
                      className={`
                        relative rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150 disabled:opacity-50
                        ${isActive
                          ? lvl === "all"
                            ? "bg-slate-800 text-white shadow-sm"
                            : `ring-2 shadow-sm ${LEVEL_STYLES[lvl as CEFRLevel].badge}`
                          : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      {lvl === "all" ? "Tất cả" : lvl}
                      {count !== null && count > 0 && !isActive && (
                        <span className="ml-1 text-[10px] opacity-60">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reload button */}
              <button
                onClick={handleReload}
                disabled={isLoadingList || isLoadingWords}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
                aria-label="Random lại 30 từ khác"
                title="Random lại 30 từ khác"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isReloading ? "animate-spin" : ""}`} aria-hidden="true" />
                Random lại
              </button>
            </div>
          )}

          {/* ── Content states ── */}
          <div aria-live="polite" aria-atomic="false">

            {/* Idle */}
            {panelState.mode === "idle" && (
              <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-center px-6 animate-fade-in">
                <div className="text-4xl mb-3" aria-hidden="true">📚</div>
                <p className="text-slate-600 font-medium">Chọn một chủ đề hoặc nhập từ khoá</p>
                <p className="text-slate-400 text-sm mt-1">để tra từ điển ngay lập tức</p>
              </div>
            )}

            {/* Loading list (fetching Datamuse) */}
            {isLoadingList && (
              <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-slate-200 bg-white text-center animate-fade-in">
                <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mb-3" aria-hidden="true" />
                <p className="text-slate-600 text-sm font-medium">Đang tải danh sách từ…</p>
              </div>
            )}

            {/* Error */}
            {panelState.mode === "error" && (
              <div className="animate-fade-in">
                <ErrorBanner
                  message={panelState.message}
                  onRetry={selectedTopic ? () => loadTopic(selectedTopic, selectedLevel) : undefined}
                />
              </div>
            )}

            {/* Empty for selected level */}
            {panelState.mode === "empty-level" && (
              <EmptyLevel
                level={selectedLevel}
                onReset={() => handleLevelChange("all")}
              />
            )}

            {/* Words grid (progressive + ready) */}
            {(isLoadingWords || panelState.mode === "ready") && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 items-stretch">
                {words.map((entry, i) => (
                  <WordCard key={entry.english} entry={entry} index={i} />
                ))}
                {/* Skeleton placeholders for pending words */}
                {isLoadingWords && skeletonCount > 0 &&
                  Array.from({ length: Math.min(skeletonCount, 12) }).map((_, i) => (
                    <WordSkeleton key={`sk-${i}`} />
                  ))
                }
              </div>
            )}

            {/* Search result header */}
            {query && panelState.mode === "ready" && words.length > 0 && (
              <div className="mt-4 text-xs text-slate-400 text-center">
                Kết quả tra từ <span className="font-semibold text-slate-600">&ldquo;{query}&rdquo;</span>
              </div>
            )}

            {/* Total count footer */}
            {selectedTopic && panelState.mode === "ready" && totalAvailable > 30 && (
              <p className="mt-4 text-center text-xs text-slate-400">
                Hiển thị 30 / {totalAvailable} từ ở level{" "}
                <span className="font-medium">{selectedLevel === "all" ? "tất cả" : selectedLevel}</span>
                {" "}· nhấn <strong>Random lại</strong> để xem bộ khác
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
