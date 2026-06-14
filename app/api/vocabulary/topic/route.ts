import type { NextRequest } from "next/server";
import { topicWords } from "@/lib/topic-words";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export interface TopicWordsResponse {
  words: string[];
  levelCounts: Record<CEFRLevel, number>;
  total: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const topicId = searchParams.get("name") ?? "";
  const level = searchParams.get("level") as CEFRLevel | "all" | null;

  const wordsByLevel = topicWords[topicId];
  if (!wordsByLevel) {
    return Response.json({ error: "Unknown topic" }, { status: 400 });
  }

  // Count words per level
  const levelCounts = CEFR_LEVELS.reduce((acc, lvl) => {
    acc[lvl] = wordsByLevel[lvl].length;
    return acc;
  }, {} as Record<CEFRLevel, number>);

  // Build pool based on level filter
  const pool: Array<{ word: string; level: CEFRLevel }> = [];
  const levelsToInclude = (!level || level === "all") ? CEFR_LEVELS : [level as CEFRLevel];
  for (const lvl of levelsToInclude) {
    for (const word of wordsByLevel[lvl]) {
      pool.push({ word, level: lvl });
    }
  }

  if (pool.length === 0) {
    return Response.json(
      { words: [], levelCounts, total: 0 } satisfies TopicWordsResponse,
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  // Shuffle and pick up to 30 — no response cache so every request yields different words
  const picked = shuffle(pool).slice(0, 30);

  return Response.json(
    { words: picked.map((w) => w.word), levelCounts, total: pool.length } satisfies TopicWordsResponse,
    { headers: { "Cache-Control": "no-store" } }
  );
}
