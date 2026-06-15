import type { NextRequest } from "next/server";
import { topicWords } from "@/lib/topic-words";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
const DEFAULT_LEVELS: CEFRLevel[] = ["A1", "A2", "B1"];

export interface TopicWordsResponse {
  words: string[];
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

  const wordsByLevel = topicWords[topicId];
  if (!wordsByLevel) {
    return Response.json({ error: "Unknown topic" }, { status: 400 });
  }

  const pool = DEFAULT_LEVELS.flatMap((level) => wordsByLevel[level]);

  if (pool.length === 0) {
    return Response.json(
      { words: [], total: 0 } satisfies TopicWordsResponse,
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const picked = shuffle(pool).slice(0, 30);

  return Response.json(
    { words: picked, total: pool.length } satisfies TopicWordsResponse,
    { headers: { "Cache-Control": "no-store" } }
  );
}
