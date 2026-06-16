import { WRITING_TOPIC_GROUPS, WRITING_TOPICS } from "@/features/writing/constants";
import type { WritingTopic, WritingTopicGroup } from "@/features/writing/types";

export interface WritingTopicsResponse {
  groups: WritingTopicGroup[];
  topics: WritingTopic[];
  source: "curated";
}

export async function GET() {
  return Response.json(
    {
      groups: WRITING_TOPIC_GROUPS,
      topics: WRITING_TOPICS,
      source: "curated",
    } satisfies WritingTopicsResponse,
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
  );
}
