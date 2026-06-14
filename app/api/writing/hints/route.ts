export interface VocabHint {
  word: string;
  translation: string; // Vietnamese meaning — shown in both EN→VI and VI→EN modes
}

export interface PhraseHint {
  phrase: string;
  translation: string;
}

export interface HintsData {
  vocab: VocabHint[];
  phrases: PhraseHint[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "a","an","the","is","are","was","were","be","been","being",
  "have","has","had","do","does","did","will","would","could",
  "should","may","might","shall","must","can","need",
  "in","on","at","to","for","of","with","by","from","as",
  "into","through","during","before","after","above","below",
  "between","out","off","over","under","again","then",
  "when","where","who","all","both","each","few","more",
  "most","other","some","such","no","not","only","same",
  "so","than","too","very","just","but","and","or","nor",
  "yet","also","this","that","these","those","its","it",
  "he","she","they","we","you","what","their","our","his","her",
  "which","about","many","any","them","every","never","since",
  "while","although","because","however","therefore","thus",
  "hence","whereas","whether","either","neither","upon","within",
  "without","including","known","used","called","often","later",
  "early","large","small","long","high","even","new","old",
  "first","last","next","second","third","own","right","left",
  "well","still","back","came","made","much","like","make",
  "time","year","way","give","take","come","seem","look",
]);

function extractKeyWords(text: string, n: number): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !STOPWORDS.has(w) && !/^\d+$/.test(w));

  const unique = [...new Set(words)];
  // Prefer longer, more specific words
  unique.sort((a, b) => b.length - a.length);
  return unique.slice(0, n);
}

function extractPhrases(text: string, n: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, n).map((s) => {
    const words = s.trim().split(/\s+/);
    const fragment = words.slice(0, 8).join(" ").replace(/[,;:]$/, "");
    return words.length > 8 ? fragment + "…" : fragment;
  });
}

async function translate(text: string, langpair: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return "";
    const data = await res.json();
    const result: string = data?.responseData?.translatedText ?? "";
    return result.toLowerCase() === text.toLowerCase() ? "" : result;
  } catch {
    return "";
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let body: { text?: string; direction?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ vocab: [], phrases: [] });
  }

  const { text, direction } = body;
  if (!text) return Response.json({ vocab: [], phrases: [] });

  const keyWords = extractKeyWords(text, 6);
  const keyPhrases = extractPhrases(text, 3);

  // Both EN→VI and VI→EN show Vietnamese meanings for English words:
  // - EN→VI: helps choose the right Vietnamese equivalent
  // - VI→EN: shows what the English hint word means so the learner can use it correctly
  const [wordTranslations, phraseTranslations] = await Promise.all([
    Promise.all(keyWords.map((w) => translate(w, "en|vi"))),
    // For VI→EN phrases are already English (from reference text) — no translation needed
    direction === "vi_to_en"
      ? Promise.resolve(keyPhrases.map(() => ""))
      : Promise.all(keyPhrases.map((p) => translate(p, "en|vi"))),
  ]);

  const vocab: VocabHint[] = keyWords.map((w, i) => ({
    word: w,
    translation: wordTranslations[i] || "—",
  }));

  const phrases: PhraseHint[] = keyPhrases.map((p, i) => ({
    phrase: p,
    translation: phraseTranslations[i] || "—",
  }));

  return Response.json({ vocab, phrases } satisfies HintsData);
}
