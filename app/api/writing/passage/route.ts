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

// ── Curated everyday-life / work topics ───────────────────────────────────────
// Only topics that map to clean Wikipedia "standard" article summaries

const EVERYDAY_TOPICS = [
  // Food & drink
  "Coffee", "Tea", "Breakfast", "Baking", "Cooking", "Restaurant",
  "Street food", "Vegetarianism", "Coffee culture", "Brunch",
  // Health & wellness
  "Yoga", "Meditation", "Exercise", "Jogging", "Cycling", "Swimming",
  "Hiking", "Sleep", "Nutrition", "Mental health", "Mindfulness",
  // People & emotions
  "Friendship", "Happiness", "Laughter", "Gratitude", "Motivation",
  "Creativity", "Optimism",
  // Work & learning
  "Remote work", "Teamwork", "Productivity", "Leadership",
  "Learning", "Reading", "Podcast", "Library", "Bookstore",
  // Leisure & hobbies
  "Photography", "Gardening", "Music", "Dance", "Fashion",
  "Online shopping", "Tourism", "Hotel", "Backpacking",
  // Technology & society
  "Social media", "Smartphone", "Email", "Commuting",
  // Pets & nature
  "Dog", "Cat", "Flower", "Bird",
];

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
  const fallback = direction === "vi_to_en" ? 420 : 900;
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

// ── Fallbacks ─────────────────────────────────────────────────────────────────

const FALLBACKS: PassageData[] = [
  {
    title: "Coffee Culture",
    text: "Coffee culture describes a social atmosphere or series of associated social behaviors that depends heavily upon coffee, particularly as a social lubricant. Many cafes serve as gathering places where people meet, work, or relax. The rise of specialty coffee shops has transformed coffee from a simple beverage into a craft and a lifestyle. People now discuss the origin of beans, brewing methods, and roasting profiles as part of their daily conversations. For many professionals, working from a cafe has become a popular alternative to the traditional office environment.",
    textVi: "Văn hóa cà phê mô tả một không khí xã hội phụ thuộc nhiều vào cà phê, đặc biệt như một chất xúc tác xã hội. Nhiều quán cà phê phục vụ như những nơi gặp gỡ để mọi người gặp nhau, làm việc hoặc thư giãn. Sự trỗi dậy của các quán cà phê đặc sản đã biến cà phê từ một thức uống đơn giản thành một nghề thủ công và một phong cách sống.",
    wordCount: 88,
    source: "https://en.wikipedia.org/wiki/Coffee_culture",
  },
  {
    title: "Friendship",
    text: "Friendship is a relationship of mutual affection between people. It is a stronger form of interpersonal bond than an association and has been studied in academic fields such as communication, sociology, social psychology, anthropology, and philosophy. Various academic theories of friendship have been proposed, including social exchange theory, equity theory, relational dialectics, and attachment styles. Although there are many forms of friendship, some of which may vary from place to place, certain characteristics are present in many types of friendship. Such characteristics include affection, sympathy, empathy, honesty, altruism, mutual understanding, and compassion.",
    textVi: "Tình bạn là mối quan hệ yêu thương lẫn nhau giữa mọi người. Đây là một hình thức liên kết giữa các cá nhân mạnh mẽ hơn một sự liên kết thông thường. Nhiều loại lý thuyết học thuật về tình bạn đã được đề xuất. Các đặc điểm của tình bạn bao gồm tình cảm, sự đồng cảm, lòng trung thực và sự hiểu biết lẫn nhau.",
    wordCount: 92,
    source: "https://en.wikipedia.org/wiki/Friendship",
  },
];

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const direction = searchParams.get("direction") === "vi_to_en" ? "vi_to_en" : "en_to_vi";
  const length = getLengthOptions(searchParams, direction);

  // EN→VI passages: longer (300 words), VI→EN: shorter (70 words) due to MyMemory limit
  const minWords = direction === "vi_to_en" ? 40 : 100;
  const trimMax  = direction === "vi_to_en" ? 70 : 300;

  const topics = shuffle([...EVERYDAY_TOPICS]);
  let passage: WikiSummary | null = null;

  // Try batches of 3 in parallel for speed
  for (let batch = 0; batch < topics.length && !passage; batch += 3) {
    const chunk = topics.slice(batch, batch + 3);
    const results = await Promise.all(chunk.map(fetchWikiTopic));
    passage = results.find((r): r is WikiSummary => !!r && isUsable(r, minWords)) ?? null;
  }

  if (!passage) {
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    const text = trimByLength(fallback.text, length.unit, length.value);
    const textVi = direction === "vi_to_en"
      ? await translatePassageToVi(text)
      : fallback.textVi;

    return Response.json(
      { ...fallback, text, textVi, wordCount: text.split(/\s+/).length },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const cleaned = passage.extract.replace(/\n+/g, " ").trim();
  const text    = trimByLength(trimToSentences(cleaned, trimMax), length.unit, length.value);
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
