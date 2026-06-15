export interface PassageData {
  title: string;
  text: string;      // English
  textVi: string;    // Vietnamese translation (populated for vi_to_en mode)
  wordCount: number;
  source: string;
}

export type PassageLengthUnit = "chars" | "lines";

interface WikiSummary {
  type: string;
  title: string;
  extract: string;
  content_urls?: { desktop?: { page?: string } };
}

interface CategoryMember {
  title?: string;
}

const WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php";

// ── Wikipedia fetch by topic title ───────────────────────────────────────────

async function fetchWikiTopic(title: string): Promise<WikiSummary | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      {
        cache: "no-store",
        headers: { "User-Agent": "LearnEnglishApp/1.0 (educational tool)" },
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchCategoryArticles(topic: string): Promise<string[]> {
  try {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${topic}`,
      cmnamespace: "0",
      cmtype: "page",
      cmlimit: "50",
      format: "json",
      origin: "*",
    });
    const response = await fetch(`${WIKIPEDIA_API}?${params}`, {
      cache: "no-store",
      headers: { "User-Agent": "LearnEnglishApp/1.0 (educational tool)" },
    });
    if (!response.ok) return [];
    const data = await response.json();
    const members: CategoryMember[] = data?.query?.categorymembers ?? [];
    return members.map((member) => member.title?.trim() ?? "").filter(Boolean);
  } catch {
    return [];
  }
}

async function searchTopicArticles(topic: string): Promise<string[]> {
  try {
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: topic,
      srnamespace: "0",
      srlimit: "20",
      format: "json",
      origin: "*",
    });
    const response = await fetch(`${WIKIPEDIA_API}?${params}`, {
      cache: "no-store",
      headers: { "User-Agent": "LearnEnglishApp/1.0 (educational tool)" },
    });
    if (!response.ok) return [];
    const data = await response.json();
    const results: CategoryMember[] = data?.query?.search ?? [];
    return results.map((result) => result.title?.trim() ?? "").filter(Boolean);
  } catch {
    return [];
  }
}

function isUsable(wiki: WikiSummary, minWords: number): boolean {
  if (wiki.type !== "standard") return false;
  if (wiki.title.toLowerCase().includes("disambiguation")) return false;
  return wiki.extract.trim().split(/\s+/).length >= minWords;
}

// Shuffle an array in place
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Trim to max words while keeping complete sentences
function trimToSentences(text: string, maxWords: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const result: string[] = [];
  let count = 0;
  for (const s of sentences) {
    const w = s.trim().split(/\s+/).length;
    if (count + w > maxWords && result.length > 0) break;
    result.push(s.trim());
    count += w;
  }
  return result.join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getLengthOptions(
  searchParams: URLSearchParams,
  direction: "en_to_vi" | "vi_to_en"
): { unit: PassageLengthUnit; value: number } {
  const unit: PassageLengthUnit = searchParams.get("lengthUnit") === "lines" ? "lines" : "chars";
  const rawValue = Number(searchParams.get("lengthValue"));
  const fallback = 400;
  const value = Number.isFinite(rawValue) ? rawValue : fallback;

  if (unit === "lines") {
    return { unit, value: clamp(Math.round(value), 2, 8) };
  }

  const maxChars = direction === "vi_to_en" ? 420 : 1200;
  return { unit, value: clamp(Math.round(value), 180, maxChars) };
}

function trimToChars(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;

  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const result: string[] = [];
  let count = 0;

  for (const s of sentences) {
    const next = s.trim();
    if (count + next.length + 1 > maxChars && result.length > 0) break;
    result.push(next);
    count += next.length + 1;
  }

  if (result.length > 0) return result.join(" ");

  const clipped = text.slice(0, maxChars).trim();
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 80 ? lastSpace : clipped.length).trim()}...`;
}

function trimToLines(text: string, maxLines: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, maxLines).map((s) => s.trim()).join(" ");
}

function trimByLength(text: string, unit: PassageLengthUnit, value: number): string {
  return unit === "lines" ? trimToLines(text, value) : trimToChars(text, value);
}

// Translate English passage to Vietnamese for vi_to_en mode (MyMemory ~450-char limit)
async function translatePassageToVi(text: string): Promise<string> {
  const truncated = text.slice(0, 420);
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncated)}&langpair=en|vi`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return "";
    const data = await res.json();
    const translated: string = data?.responseData?.translatedText ?? "";
    return translated.toLowerCase() === truncated.toLowerCase() ? "" : translated;
  } catch {
    return "";
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const direction = searchParams.get("direction") === "vi_to_en" ? "vi_to_en" : "en_to_vi";
  const topic = searchParams.get("topic")?.trim() ?? "";
  const length = getLengthOptions(searchParams, direction);

  if (!topic || topic.length > 80 || !/^[\p{L}\p{N}&,' -]+$/u.test(topic)) {
    return Response.json({ error: "A valid topic is required" }, { status: 400 });
  }

  const minWords = length.unit === "chars"
    ? clamp(Math.floor(length.value / 8), 30, 100)
    : clamp(length.value * 18, 30, 100);
  const trimMax  = direction === "vi_to_en" ? 70 : 300;

  const categoryArticles = await fetchCategoryArticles(topic);
  const articleTitles = shuffle([...categoryArticles]);
  let passage: WikiSummary | null = null;

  for (let batch = 0; batch < Math.min(articleTitles.length, 18) && !passage; batch += 3) {
    const chunk = articleTitles.slice(batch, batch + 3);
    const results = await Promise.all(chunk.map(fetchWikiTopic));
    passage = results.find((r): r is WikiSummary => !!r && isUsable(r, minWords)) ?? null;
  }

  if (!passage) {
    const topicSummary = await fetchWikiTopic(topic);
    passage = topicSummary && isUsable(topicSummary, Math.min(minWords, 40)) ? topicSummary : null;
  }

  if (!passage) {
    const searchResults = shuffle(await searchTopicArticles(topic));
    const summaries = await Promise.all(searchResults.slice(0, 9).map(fetchWikiTopic));
    passage = summaries.find((result): result is WikiSummary => !!result && isUsable(result, Math.min(minWords, 40))) ?? null;
  }

  if (!passage) {
    return Response.json({ error: "No suitable passage found for this topic" }, { status: 502 });
  }

  const cleaned = passage.extract.replace(/\n+/g, " ").trim();
  const requestedText = trimByLength(trimToSentences(cleaned, trimMax), length.unit, length.value);
  const text = direction === "vi_to_en" ? trimToChars(requestedText, 420) : requestedText;
  const textVi  = direction === "vi_to_en" ? await translatePassageToVi(text) : "";

  const data: PassageData = {
    title: passage.title,
    text,
    textVi,
    wordCount: text.split(/\s+/).length,
    source: passage.content_urls?.desktop?.page ?? "",
  };

  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
