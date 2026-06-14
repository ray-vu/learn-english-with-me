import type { NextRequest } from "next/server";

export interface VocabularyEntry {
  english: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  vietnamese: string;
  example: string;
  exampleVi: string;
  audio: string;
}

interface DictPhonetic {
  text?: string;
  audio?: string;
}

interface DictDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface DictMeaning {
  partOfSpeech: string;
  definitions: DictDefinition[];
}

interface DictEntry {
  word: string;
  phonetic?: string;
  phonetics: DictPhonetic[];
  meanings: DictMeaning[];
}

async function translateToVietnamese(text: string): Promise<string> {
  if (!text.trim()) return "";
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return "";
    const data = await res.json();
    const translated: string = data?.responseData?.translatedText ?? "";
    // MyMemory sometimes echoes back the original if translation fails
    return translated && translated.toLowerCase() !== text.toLowerCase()
      ? translated
      : "";
  } catch {
    return "";
  }
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/vocabulary/[word]">
) {
  const { word } = await ctx.params;
  const normalized = word.toLowerCase().trim();

  if (!normalized || !/^[a-z\-' ]+$/.test(normalized)) {
    return Response.json({ error: "Invalid word" }, { status: 400 });
  }

  // Fetch dictionary data
  let dictData: DictEntry[];
  try {
    const dictRes = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`,
      { next: { revalidate: 86400 } }
    );
    if (!dictRes.ok) {
      return Response.json({ error: "Word not found" }, { status: 404 });
    }
    dictData = await dictRes.json();
  } catch {
    return Response.json({ error: "Dictionary service unavailable" }, { status: 502 });
  }

  const entry = dictData[0];
  const phonetic =
    entry.phonetic ??
    entry.phonetics.find((p) => p.text)?.text ??
    "";
  const audio =
    entry.phonetics.find((p) => p.audio && p.audio.startsWith("https"))?.audio ?? "";

  // Pick first meaning that has a definition
  const meaning = entry.meanings?.[0];
  const definition = meaning?.definitions?.[0];
  const partOfSpeech = meaning?.partOfSpeech ?? "";
  const definitionText = definition?.definition ?? "";
  const example = definition?.example ?? "";

  // Translate the word itself (not the definition) → "egg" → "Trứng", "meat" → "Thịt"
  // Then translate the example sentence separately for context
  const [vietnamese, exampleVi] = await Promise.all([
    translateToVietnamese(entry.word),
    translateToVietnamese(example),
  ]);

  const result: VocabularyEntry = {
    english: entry.word,
    phonetic,
    partOfSpeech,
    definition: definitionText,
    vietnamese,
    example,
    exampleVi,
    audio,
  };

  return Response.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
