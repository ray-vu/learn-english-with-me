import {
  generateWritingPassage,
  type Direction,
  type PassageLengthUnit,
} from "@/features/writing/server/passageGenerator";

export interface PassageData {
  title: string;
  text: string;
  textVi: string;
  wordCount: number;
  source: string;
}

export type { PassageLengthUnit };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getLengthOptions(
  searchParams: URLSearchParams,
  direction: Direction
): { unit: PassageLengthUnit; value: number } {
  const unit: PassageLengthUnit = searchParams.get("lengthUnit") === "lines" ? "lines" : "chars";
  const rawValue = Number(searchParams.get("lengthValue"));
  const value = Number.isFinite(rawValue) ? rawValue : 400;

  if (unit === "lines") {
    return { unit, value: clamp(Math.round(value), 2, 8) };
  }

  return { unit, value: clamp(Math.round(value), 180, direction === "vi_to_en" ? 420 : 1200) };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const direction: Direction = searchParams.get("direction") === "vi_to_en" ? "vi_to_en" : "en_to_vi";
  const topicLabel = searchParams.get("topic")?.trim() ?? "";
  const length = getLengthOptions(searchParams, direction);
  const passage = generateWritingPassage({
    direction,
    lengthUnit: length.unit,
    lengthValue: length.value,
    topicLabel,
  });

  if (!passage) {
    return Response.json({ error: "A valid curated topic is required" }, { status: 400 });
  }

  return Response.json(passage satisfies PassageData, {
    headers: { "Cache-Control": "no-store" },
  });
}
