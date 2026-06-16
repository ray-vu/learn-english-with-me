import type { PassageData, PassageLengthUnit } from "@/app/api/writing/passage/route";
import type { HintsData } from "@/app/api/writing/hints/route";
import type { ScoreResult } from "@/app/api/writing/score/route";

export type Direction = "en_to_vi" | "vi_to_en";
export type PageState = "idle" | "loading" | "ready" | "scoring" | "scored" | "error";

export interface WritingTopic {
  id: string;
  label: string;
  categoryId: string;
  vietnamese: string;
}

export interface WritingTopicGroup {
  id: string;
  label: string;
  topics: WritingTopic[];
}

export type {
  HintsData,
  PassageData,
  PassageLengthUnit,
  ScoreResult,
};
