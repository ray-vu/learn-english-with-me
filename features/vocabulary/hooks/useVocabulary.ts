"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TopicWordsResponse } from "@/app/api/vocabulary/topic/route";
import type { PanelState, Topic, VocabularyEntry } from "../types";
import { fetchWordDetail, orderEntries } from "../utils";

export function useVocabulary() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [query, setQuery] = useState("");
  const [panelState, setPanelState] = useState<PanelState>({ mode: "idle" });
  const [isReloading, setIsReloading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTopic = useCallback(async (topic: Topic, reload = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    if (reload) {
      setIsReloading(true);
    } else {
      setPanelState({ mode: "loading-list" });
    }

    let topicData: TopicWordsResponse;
    try {
      const response = await fetch(
        `/api/vocabulary/topic?name=${encodeURIComponent(topic.id)}`,
        { signal: controller.signal, cache: "no-store" }
      );
      if (!response.ok) throw new Error("topic_fetch_error");
      topicData = await response.json();
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      setPanelState({ mode: "error", message: "Không thể tải danh sách từ vựng. Vui lòng thử lại." });
      setIsReloading(false);
      return;
    }

    if (controller.signal.aborted) return;
    if (topicData.words.length === 0) {
      setPanelState({ mode: "error", message: "Chủ đề này chưa có từ vựng phù hợp." });
      setIsReloading(false);
      return;
    }

    const wordList = topicData.words;
    const entries: VocabularyEntry[] = [];
    setPanelState({ mode: "loading-words", words: [], wordList });
    setIsReloading(false);

    await Promise.all(wordList.map(async (word) => {
      try {
        const entry = await fetchWordDetail(word);
        if (controller.signal.aborted || !entry) return;
        entries.push(entry);
        setPanelState({
          mode: "loading-words",
          words: orderEntries(wordList, entries),
          wordList,
        });
      } catch {
        // A single dictionary failure should not block the remaining cards.
      }
    }));

    if (controller.signal.aborted) return;
    const ordered = orderEntries(wordList, entries);
    setPanelState(ordered.length
      ? { mode: "ready", words: ordered }
      : { mode: "error", message: "Không thể tải chi tiết từ vựng. Vui lòng thử lại." });
  }, []);

  const searchWord = useCallback(async (word: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPanelState({ mode: "loading-list" });
    try {
      const entry = await fetchWordDetail(word);
      if (controller.signal.aborted) return;
      setPanelState(entry
        ? { mode: "ready", words: [entry] }
        : { mode: "error", message: `Không tìm thấy từ "${word}"` });
    } catch {
      if (!controller.signal.aborted) {
        setPanelState({ mode: "error", message: "Lỗi kết nối. Vui lòng thử lại." });
      }
    }
  }, []);

  const selectTopic = useCallback((topic: Topic) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setQuery("");
    setSelectedTopic((current) => {
      if (current?.id === topic.id) {
        setPanelState({ mode: "idle" });
        return null;
      }
      loadTopic(topic);
      return topic;
    });
  }, [loadTopic]);

  const updateQuery = useCallback((value: string) => {
    setQuery(value);
    setSelectedTopic(null);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    const trimmed = value.trim();
    if (!trimmed) {
      setPanelState({ mode: "idle" });
      return;
    }
    if (trimmed.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => searchWord(trimmed), 500);
    }
  }, [searchWord]);

  const clearSearch = useCallback(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    abortRef.current?.abort();
    setQuery("");
    setPanelState({ mode: "idle" });
    inputRef.current?.focus();
  }, []);

  const reload = useCallback(() => {
    if (selectedTopic) loadTopic(selectedTopic, true);
  }, [loadTopic, selectedTopic]);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  }, []);

  const loadingWords = panelState.mode === "loading-words";
  const words = panelState.mode === "ready" || loadingWords ? panelState.words : [];
  const wordList = loadingWords ? panelState.wordList : null;

  return {
    clearSearch, inputRef, isLoadingList: panelState.mode === "loading-list",
    isReloading, isLoadingWords: loadingWords, loadTopic, panelState, query,
    reload, selectedTopic, selectTopic, skeletonCount: wordList ? wordList.length - words.length : 0,
    updateQuery, wordList, words,
  };
}
