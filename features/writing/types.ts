import type { PassageData, PassageLengthUnit } from "@/app/api/writing/passage/route";
import type { HintsData } from "@/app/api/writing/hints/route";
import type { ScoreResult } from "@/app/api/writing/score/route";
import type { WritingTopic } from "@/app/api/writing/topics/route";

export type Direction = "en_to_vi" | "vi_to_en";
export type PageState = "idle" | "loading" | "ready" | "scoring" | "scored" | "error";

export type {
  HintsData,
  PassageData,
  PassageLengthUnit,
  ScoreResult,
  WritingTopic,
};
