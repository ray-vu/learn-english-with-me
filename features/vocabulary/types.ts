import type { VocabularyEntry } from "@/app/api/vocabulary/[word]/route";
import type { Topic } from "@/lib/vocabulary-data";

export type PanelState =
  | { mode: "idle" }
  | { mode: "loading-list" }
  | { mode: "loading-words"; words: VocabularyEntry[]; wordList: string[] }
  | { mode: "ready"; words: VocabularyEntry[] }
  | { mode: "error"; message: string };

export type { Topic, VocabularyEntry };

export interface PosConfig {
  accent: string;
  initial: string;
  label: string;
  meaning: string;
}
