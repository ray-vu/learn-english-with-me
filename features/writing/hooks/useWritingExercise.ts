"use client";

import { useCallback, useRef, useState } from "react";
import { LENGTH_LIMITS, WRITING_TOPIC_GROUPS } from "../constants";
import type {
  Direction, HintsData, PageState, PassageData,
  PassageLengthUnit, ScoreResult,
} from "../types";
import { clampLength, countWords } from "../utils";

export function useWritingExercise() {
  const [passage, setPassage] = useState<PassageData | null>(null);
  const [direction, setDirection] = useState<Direction>("en_to_vi");
  const [pageState, setPageState] = useState<PageState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [userText, setUserText] = useState("");
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [hints, setHints] = useState<HintsData | null>(null);
  const [hintsLoading, setHintsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [lengthUnit, setLengthUnit] = useState<PassageLengthUnit>("chars");
  const [lengthValue, setLengthValue] = useState(400);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  const loadHints = useCallback(async (text: string, dir: Direction) => {
    setHintsLoading(true);
    setHints(null);
    try {
      const response = await fetch("/api/writing/hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, direction: dir }),
      });
      if (response.ok) setHints(await response.json());
    } catch {
      // Hints are optional and should not block the exercise.
    } finally {
      setHintsLoading(false);
    }
  }, []);

  const clearExercise = useCallback(() => {
    setPassage(null);
    setUserText("");
    setScoreResult(null);
    setHints(null);
    setErrorMsg("");
    setPageState("idle");
  }, []);

  const loadPassage = useCallback(async () => {
    if (!selectedTopic) return;
    setPageState("loading");
    setScoreResult(null);
    setUserText("");
    setErrorMsg("");
    setHints(null);
    setHintsLoading(false);
    try {
      const params = new URLSearchParams({
        direction,
        topic: selectedTopic,
        lengthUnit,
        lengthValue: String(clampLength(lengthValue, lengthUnit, direction)),
      });
      const response = await fetch(`/api/writing/passage?${params}`, { cache: "no-store" });
      if (!response.ok) throw new Error("fetch_error");
      const data: PassageData = await response.json();
      setPassage(data);
      setPageState("ready");
      loadHints(data.text, direction);
    } catch {
      setErrorMsg("Không thể tải đoạn văn. Vui lòng thử lại.");
      setPageState("error");
    }
  }, [direction, lengthUnit, lengthValue, loadHints, selectedTopic]);

  const changeDirection = useCallback((next: Direction) => {
    setDirection(next);
    setLengthValue((value) => clampLength(value, lengthUnit, next));
    clearExercise();
  }, [clearExercise, lengthUnit]);

  const changeTopic = useCallback((topic: string) => {
    setSelectedTopic(topic);
    clearExercise();
  }, [clearExercise]);

  const changeLengthUnit = useCallback((unit: PassageLengthUnit) => {
    setLengthUnit(unit);
    setLengthValue((value) => clampLength(value, unit, direction));
  }, [direction]);

  const normalizeLength = useCallback(() => {
    setLengthValue((value) => clampLength(value, lengthUnit, direction));
  }, [direction, lengthUnit]);

  const scoreTranslation = useCallback(async () => {
    if (!passage || countWords(userText) < 5) return;
    setPageState("scoring");
    try {
      const body = direction === "vi_to_en"
        ? { text: passage.textVi || passage.text, translation: userText, direction, referenceEn: passage.text }
        : { text: passage.text, translation: userText, direction };
      const response = await fetch("/api/writing/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("score_error");
      setScoreResult(await response.json());
      setPageState("scored");
      setTimeout(() => scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setErrorMsg("Không thể chấm điểm. Vui lòng thử lại.");
      setPageState("ready");
    }
  }, [direction, passage, userText]);

  const clearTranslation = useCallback(() => {
    setUserText("");
    setScoreResult(null);
    setPageState("ready");
    textareaRef.current?.focus();
  }, []);

  const wordCount = countWords(userText);
  const isLoading = pageState === "loading";
  const isBusy = pageState === "loading" || pageState === "scoring";
  const limits = LENGTH_LIMITS[lengthUnit];
  const activeLengthMax = lengthUnit === "chars" && direction === "vi_to_en" ? 420 : limits.max;

  return {
    activeLengthMax, canGenerate: Boolean(selectedTopic) && !isBusy,
    canScore: wordCount >= 5 && pageState === "ready", changeDirection,
    changeLengthUnit, changeTopic, clearTranslation, direction, errorMsg,
    hints, hintsLoading, isBusy, isLoading, lengthUnit, lengthValue, limits, loadPassage,
    normalizeLength, pageState, passage, scoreRef, scoreResult, scoreTranslation,
    selectedTopic, setLengthValue, setUserText, textareaRef, topicGroups: WRITING_TOPIC_GROUPS,
    userText, wordCount,
  };
}
