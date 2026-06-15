"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search, X, Volume2, ChevronRight, BookOpen,
  Lightbulb, AlertCircle, Loader2, RefreshCw,
} from "lucide-react";
import { topics, type Topic } from "@/lib/vocabulary-data";
import type { VocabularyEntry } from "@/app/api/vocabulary/[word]/route";
import type { TopicWordsResponse } from "@/app/api/vocabulary/topic/route";

// ── constants ─────────────────────────────────────────────────────────────────

type PosConfig = {
  accent: string;
  initial: string;
  label: string;
  meaning: string;
};

const POS_CONFIG: Record<string, PosConfig> = {
  noun:      { accent: "bg-amber-400",   initial: "bg-amber-50 text-amber-700",   label: "text-amber-700",   meaning: "bg-amber-50/70 border-amber-100" },
  verb:      { accent: "bg-violet-500",  initial: "bg-violet-50 text-violet-700", label: "text-violet-700", meaning: "bg-violet-50/70 border-violet-100" },
  adjective: { accent: "bg-rose-400",    initial: "bg-rose-50 text-rose-700",     label: "text-rose-700",   meaning: "bg-rose-50/70 border-rose-100" },
  adverb:    { accent: "bg-cyan-500",    initial: "bg-cyan-50 text-cyan-700",     label: "text-cyan-700",   meaning: "bg-cyan-50/70 border-cyan-100" },
  pronoun:   { accent: "bg-lime-500",    initial: "bg-lime-50 text-lime-700",     label: "text-lime-700",   meaning: "bg-lime-50/70 border-lime-100" },
  default:   { accent: "bg-slate-400",   initial: "bg-slate-100 text-slate-700",  label: "text-slate-500",  meaning: "bg-slate-50 border-slate-100" },
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

function WordSkeleton() {
  return (
    <div className="relative flex min-h-[188px] h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
      <div className="absolute inset-y-0 left-0 w-1 bg-slate-100" />
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl bg-slate-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-28 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-9 rounded-full bg-slate-100 flex-shrink-0" />
      </div>
      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-2">
        <div className="h-3 w-16 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
      </div>
      <div className="mt-auto pt-4">
        <div className="h-3 w-24 rounded bg-slate-100" />
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

function WordCard({ entry, index }: { entry: VocabularyEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const pos = entry.partOfSpeech?.toLowerCase() ?? "";
  const posConf = POS_CONFIG[pos] ?? POS_CONFIG.default;
  const initial = entry.english.charAt(0).toUpperCase();

  return (
    <div
      className={`animate-fade-in-up opacity-0 stagger-${Math.min(index + 1, 8)} h-full`}
      style={{ animationFillMode: "forwards" }}
    >
      <article
        className={`
          relative flex min-h-[188px] h-full flex-col overflow-hidden rounded-xl border bg-white
          cursor-pointer select-none transition-all duration-200 group
          ${expanded
            ? "border-slate-300 shadow-lg shadow-slate-200/60"
            : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50"
          }
        `}
        onClick={() => setExpanded((v) => !v)}
        aria-label={`Từ: ${entry.english}`}
      >
        <div className={`absolute inset-y-0 left-0 w-1 ${posConf.accent}`} aria-hidden="true" />

        <div className="flex items-start gap-3 px-4 pt-4">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold ${posConf.initial}`}>
            {initial}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <span className="min-w-0 break-words text-lg font-bold leading-tight text-slate-900">
                {entry.english}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              {entry.phonetic && <span className="text-xs font-mono text-slate-400">{entry.phonetic}</span>}
              {entry.partOfSpeech && (
                <span className={`text-[11px] font-semibold uppercase ${posConf.label}`}>
                  {entry.partOfSpeech}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); speak(entry); }}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
            aria-label={`Nghe phát âm: ${entry.english}`}
            title="Nghe phát âm"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className={`mx-4 mt-4 rounded-lg border px-3.5 py-3 ${posConf.meaning}`}>
          <div className="mb-1 text-[10px] font-bold uppercase text-slate-400">Nghĩa tiếng Việt</div>
          {entry.vietnamese ? (
            <p className={`text-sm font-semibold leading-snug text-slate-800 ${expanded ? "" : "line-clamp-2"}`}>
              {entry.vietnamese}
            </p>
          ) : entry.definition ? (
            <p className={`text-xs leading-snug text-slate-500 ${expanded ? "" : "line-clamp-2"}`}>
              {entry.definition}
            </p>
          ) : (
            <p className="text-xs text-slate-300 italic">Đang tải…</p>
          )}
        </div>

        {expanded && (
          <div className="mx-4 mt-3 space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-3 animate-fade-in">
            {entry.definition && (
              <div className="flex gap-2 items-start">
                <BookOpen className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-slate-600 leading-relaxed">{entry.definition}</p>
              </div>
            )}
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

        <div className="mt-auto flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 transition group-hover:text-slate-600">
            <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`} aria-hidden="true" />
            {expanded ? "Thu gọn" : "Xem ví dụ"}
          </span>
          <span className="text-[10px] font-medium text-slate-300">#{String(index + 1).padStart(2, "0")}</span>
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
        w-full flex items-center gap-2.5 lg:gap-3 rounded-xl p-2.5 lg:p-3 text-left transition-all duration-150 border
        ${isActive
          ? `bg-gradient-to-r ${topic.gradient} text-white border-transparent shadow-sm`
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
        }
      `}
    >
      <span className="text-lg lg:text-xl flex-shrink-0" role="img" aria-hidden="true">{topic.icon}</span>
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
  | { mode: "loading-words"; words: VocabularyEntry[]; wordList: string[] }
  | { mode: "ready"; words: VocabularyEntry[] }
  | { mode: "error"; message: string };

// ── main page ─────────────────────────────────────────────────────────────────

export default function VocabularyPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [query, setQuery] = useState("");
  const [panelState, setPanelState] = useState<PanelState>({ mode: "idle" });
  const [isReloading, setIsReloading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── fetch topic word list → then fetch each word detail progressively ──

  const loadTopic = useCallback(async (topic: Topic, isReload = false) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    if (isReload) {
      setIsReloading(true);
    } else {
      setPanelState({ mode: "loading-list" });
    }

    let topicData: TopicWordsResponse;
    try {
      const url = `/api/vocabulary/topic?name=${encodeURIComponent(topic.id)}`;
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
      setPanelState({ mode: "error", message: "Chủ đề này chưa có từ vựng phù hợp." });
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
        setPanelState({ mode: "ready", words: [entry] });
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
      loadTopic(topic);
      return topic;
    });
  }, [loadTopic]);

  const handleReload = useCallback(() => {
    if (!selectedTopic) return;
    loadTopic(selectedTopic, true);
  }, [selectedTopic, loadTopic]);

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
  const skeletonCount = wordList ? wordList.length - words.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>Học từ vựng</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Từ vựng theo chủ đề</h1>
        <p className="text-slate-500 text-sm mt-1">
          Chọn chủ đề để học từ thông dụng, hoặc tra bất kỳ từ nào
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* ── Left panel ── */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-3 lg:space-y-4">
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
          <nav aria-label="Chủ đề từ vựng" className="-mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="mb-2 flex items-center justify-between lg:hidden">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Chủ đề</span>
              <span className="text-xs text-slate-400">Vuốt để xem thêm</span>
            </div>
            <ul
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0"
              role="list"
            >
              {topics.map((topic) => (
                <li key={topic.id} className="w-40 flex-shrink-0 lg:w-auto">
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

          {/* ── Topic summary + reload ── */}
          {selectedTopic && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm animate-fade-in sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${selectedTopic.gradient} shadow-sm`}>
                  <span className="text-base" role="img" aria-hidden="true">{selectedTopic.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">{selectedTopic.title}</div>
                  {(panelState.mode === "ready" || panelState.mode === "loading-words") && (
                    <div className="text-xs text-slate-400" aria-live="polite">
                      {words.length}/{wordList ? wordList.length : words.length} từ
                      {isLoadingWords && <Loader2 className="inline ml-1 h-3 w-3 text-indigo-400 animate-spin" aria-hidden="true" />}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleReload}
                disabled={isLoadingList || isLoadingWords}
                className="flex h-9 flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Xáo trộn lại danh sách từ"
                title="Xáo trộn lại danh sách từ"
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
                  onRetry={selectedTopic ? () => loadTopic(selectedTopic) : undefined}
                />
              </div>
            )}

            {/* Words grid (progressive + ready) */}
            {(isLoadingWords || panelState.mode === "ready") && (
              <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
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

          </div>
        </div>
      </div>
    </div>
  );
}
