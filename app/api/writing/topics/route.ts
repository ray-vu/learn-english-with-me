export interface WritingTopic {
  id: string;
  label: string;
}

export interface WritingTopicsResponse {
  topics: WritingTopic[];
  source: "wikipedia" | "fallback";
}

interface CategoryMember {
  title?: string;
}

const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";

const EXCLUDED_TOPICS = new Set([
  "Academic disciplines",
  "Concepts",
  "Entities",
  "Humans",
  "Information",
  "Knowledge",
  "Life",
  "Main topic articles",
  "Time",
]);

const FALLBACK_TOPICS = [
  "Culture",
  "Economy",
  "Education",
  "Engineering",
  "Food and drink",
  "Geography",
  "Health",
  "History",
  "Language",
  "Law",
  "Mass media",
  "Mathematics",
  "Philosophy",
  "Politics",
  "Science",
  "Society",
  "Technology",
  "Universe",
];

function toTopic(label: string): WritingTopic {
  return {
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    label,
  };
}

export async function GET() {
  try {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: "Category:Main topic classifications",
      cmtype: "subcat",
      cmlimit: "100",
      format: "json",
      origin: "*",
    });
    const response = await fetch(`${WIKIPEDIA_API}?${params}`, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": "LearnEnglishApp/1.0 (educational tool)" },
    });
    if (!response.ok) throw new Error("wikipedia_topics_unavailable");

    const data = await response.json();
    const members: CategoryMember[] = data?.query?.categorymembers ?? [];
    const labels = members
      .map((member) => member.title?.replace(/^Category:/, "").trim() ?? "")
      .filter((label) => label && !EXCLUDED_TOPICS.has(label))
      .sort((a, b) => a.localeCompare(b));

    if (labels.length === 0) throw new Error("wikipedia_topics_empty");

    return Response.json(
      { topics: labels.map(toTopic), source: "wikipedia" } satisfies WritingTopicsResponse,
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" } }
    );
  } catch {
    return Response.json(
      { topics: FALLBACK_TOPICS.map(toTopic), source: "fallback" } satisfies WritingTopicsResponse,
      { headers: { "Cache-Control": "public, s-maxage=300" } }
    );
  }
}
