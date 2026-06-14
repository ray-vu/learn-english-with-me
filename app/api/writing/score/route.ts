export interface ScoreResult {
  total: number;
  grade: string;
  gradeColor: string;
  scores: {
    similarity: number;
    length: number;
    grammar: number;
  };
  reference: string;
  feedback: string[];
  hasReference: boolean;
}

// ── Tokenizer (handles both EN & VI) ─────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

// ── F1-weighted word overlap score (0–100) ────────────────────────────────────
// Precision + Recall balanced — penalises both missing and extra words

function overlapScore(hyp: string[], ref: string[]): number {
  if (!hyp.length || !ref.length) return 0;

  const refMap = new Map<string, number>();
  ref.forEach((w) => refMap.set(w, (refMap.get(w) ?? 0) + 1));

  let matches = 0;
  const used = new Map<string, number>();
  hyp.forEach((w) => {
    const avail = (refMap.get(w) ?? 0) - (used.get(w) ?? 0);
    if (avail > 0) {
      matches++;
      used.set(w, (used.get(w) ?? 0) + 1);
    }
  });

  const precision = matches / hyp.length;
  const recall = matches / ref.length;
  if (!precision && !recall) return 0;

  // Weighted F: recall matters more (don't miss meaning)
  const score = (2.5 * precision * recall) / (1.5 * precision + recall);
  return Math.min(100, Math.round(score * 100));
}

// ── Length proportionality score (0–100) ─────────────────────────────────────

function lengthScore(srcText: string, transText: string, direction: "en_to_vi" | "vi_to_en" = "en_to_vi"): number {
  const src = srcText.trim().split(/\s+/).length;
  const trans = transText.trim().split(/\s+/).length;
  if (trans < 5) return 0;
  const ratio = trans / src;

  if (direction === "vi_to_en") {
    // English output should be roughly 0.6–1.5× the Vietnamese source
    if (ratio < 0.2) return Math.round(ratio * 200);
    if (ratio >= 0.6 && ratio <= 1.5) return 100;
    if (ratio < 0.6) return Math.round(40 + (ratio - 0.2) * 150);
    return Math.max(40, Math.round(100 - (ratio - 1.5) * 45));
  }

  // EN→VI: Vietnamese is typically 0.25–1.8× the English length
  if (ratio < 0.15) return Math.round(ratio * 250);
  if (ratio >= 0.25 && ratio <= 1.8) return 100;
  if (ratio < 0.25) return Math.round(30 + (ratio - 0.15) * 700);
  return Math.max(40, Math.round(100 - (ratio - 1.8) * 35));
}

// ── LanguageTool grammar check (0–100) ───────────────────────────────────────

async function grammarScore(text: string, language: string): Promise<number> {
  try {
    const body = new URLSearchParams({ text: text.slice(0, 1000), language });
    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!res.ok) return -1; // unavailable
    const data = await res.json();
    const errors: number = data.matches?.length ?? 0;
    const words = text.split(/\s+/).length;
    const errorRate = errors / Math.max(words, 1);
    return Math.max(0, Math.round(100 - errorRate * 180));
  } catch {
    return -1;
  }
}

// ── MyMemory reference translation ───────────────────────────────────────────

async function getReference(text: string): Promise<string> {
  // MyMemory max ~450 chars; use first ~400 chars of the passage
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

// ── Grade mapping ─────────────────────────────────────────────────────────────

function getGrade(score: number): { label: string; color: string } {
  if (score >= 88) return { label: "Xuất sắc",      color: "#10b981" };
  if (score >= 75) return { label: "Tốt",            color: "#3b82f6" };
  if (score >= 60) return { label: "Khá",            color: "#f59e0b" };
  if (score >= 45) return { label: "Trung bình",     color: "#f97316" };
  return              { label: "Cần cố gắng",     color: "#ef4444" };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let body: {
    text?: string;
    translation?: string;
    direction?: "en_to_vi" | "vi_to_en";
    referenceEn?: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { text, translation, referenceEn } = body;
  const direction = body.direction === "vi_to_en" ? "vi_to_en" : "en_to_vi";

  if (!text || !translation || translation.trim().split(/\s+/).length < 5) {
    return Response.json({ error: "Text and translation are required" }, { status: 400 });
  }

  let reference: string;
  let grammarRaw: number;

  if (direction === "vi_to_en") {
    // For VI→EN: use the provided original English as the reference; check English grammar
    reference = referenceEn ?? "";
    grammarRaw = await grammarScore(translation, "en-US");
  } else {
    // For EN→VI: fetch MyMemory reference + check Vietnamese grammar (in parallel)
    [reference, grammarRaw] = await Promise.all([
      getReference(text),
      grammarScore(translation, "vi"),
    ]);
  }

  const hasReference = reference.length > 10;

  const hypTokens = tokenize(translation);
  const refTokens = hasReference ? tokenize(reference) : [];

  const simScore = hasReference ? overlapScore(hypTokens, refTokens) : 0;
  const lenScore = lengthScore(text, translation, direction);
  const gramScore = grammarRaw >= 0 ? grammarRaw : 70;

  // Weighted total
  let total: number;
  if (hasReference && grammarRaw >= 0) {
    total = Math.round(simScore * 0.55 + lenScore * 0.25 + gramScore * 0.20);
  } else if (hasReference) {
    total = Math.round(simScore * 0.70 + lenScore * 0.30);
  } else {
    total = Math.round(lenScore * 0.60 + gramScore * 0.40);
  }

  const { label: grade, color: gradeColor } = getGrade(total);

  // Contextual feedback
  const feedback: string[] = [];

  if (hasReference) {
    if (simScore >= 70) feedback.push("Từ vựng và ý nghĩa rất chính xác — bám sát bản gốc tốt!");
    else if (simScore >= 45) feedback.push("Một số ý chưa sát nghĩa, hãy đọc lại từng câu trong đoạn gốc.");
    else feedback.push("Hãy cố gắng dịch sát từng câu hơn, tránh diễn giải quá tự do.");
  }

  if (lenScore < 50) {
    feedback.push("Bản dịch khá ngắn — có thể bạn đã bỏ sót một số câu quan trọng.");
  } else if (lenScore === 100) {
    feedback.push("Độ dài bản dịch rất phù hợp với đoạn gốc!");
  }

  if (grammarRaw >= 0) {
    if (gramScore >= 80) feedback.push("Ngữ pháp tốt, ít lỗi chính tả hoặc cấu trúc.");
    else if (gramScore < 50) feedback.push("Có một số lỗi ngữ pháp hoặc chính tả, hãy rà soát lại.");
  }

  if (!hasReference) {
    feedback.push("Không thể lấy bản dịch tham khảo lúc này — điểm được tính dựa trên độ dài và ngữ pháp.");
  }

  const result: ScoreResult = {
    total,
    grade,
    gradeColor,
    scores: { similarity: simScore, length: lenScore, grammar: gramScore },
    reference,
    feedback,
    hasReference,
  };

  return Response.json(result);
}
