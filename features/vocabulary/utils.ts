import type { VocabularyEntry } from "./types";

export async function fetchWordDetail(word: string): Promise<VocabularyEntry | null> {
  const response = await fetch(`/api/vocabulary/${encodeURIComponent(word)}`);
  if (!response.ok) return null;
  return response.json();
}

export function orderEntries(
  wordList: string[],
  entries: VocabularyEntry[]
): VocabularyEntry[] {
  return wordList
    .map((word) => entries.find(
      (entry) => entry.english.toLowerCase() === word.toLowerCase()
    ))
    .filter((entry): entry is VocabularyEntry => Boolean(entry));
}

export function speakWord(entry: VocabularyEntry) {
  if (!("speechSynthesis" in window)) return;

  const speakFallback = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(entry.english);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (entry.audio) {
    new Audio(entry.audio).play().catch(speakFallback);
  } else {
    speakFallback();
  }
}
