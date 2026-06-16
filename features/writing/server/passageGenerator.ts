import { WRITING_TOPICS } from "../constants";

export interface GeneratedPassage {
  title: string;
  text: string;
  textVi: string;
  wordCount: number;
  source: string;
}

export type PassageLengthUnit = "chars" | "lines";
export type Direction = "en_to_vi" | "vi_to_en";

interface SentencePair {
  en: string;
  vi: string;
}

interface GenerateOptions {
  direction: Direction;
  lengthUnit: PassageLengthUnit;
  lengthValue: number;
  topicLabel: string;
}

function trimToChars(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const result: string[] = [];
  let count = 0;

  for (const sentence of sentences) {
    const next = sentence.trim();
    if (count + next.length + 1 > maxChars && result.length > 0) break;
    result.push(next);
    count += next.length + 1;
  }

  return result.length ? result.join(" ") : `${text.slice(0, maxChars - 3).trim()}...`;
}

function trimByLength(sentences: SentencePair[], unit: PassageLengthUnit, value: number) {
  const selected = unit === "lines" ? sentences.slice(0, value) : sentences;
  if (unit === "lines") {
    return {
      en: selected.map((sentence) => sentence.en).join(" "),
      vi: selected.map((sentence) => sentence.vi).join(" "),
    };
  }

  return {
    en: trimToChars(selected.map((sentence) => sentence.en).join(" "), value),
    vi: trimToChars(selected.map((sentence) => sentence.vi).join(" "), value),
  };
}

function rotateSentences(sentences: SentencePair[], seed: string): SentencePair[] {
  const offset = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % sentences.length;
  return [...sentences.slice(offset), ...sentences.slice(0, offset)];
}

function buildSentences(label: string, viTopic: string, categoryId: string): SentencePair[] {
  const topic = label.toLowerCase();
  const base: SentencePair[] = [
    { en: `This short passage is about ${topic}.`, vi: `Đoạn văn ngắn này nói về ${viTopic}.` },
    {
      en: "It is a useful topic because it appears in many simple conversations.",
      vi: "Đây là một chủ đề hữu ích vì nó xuất hiện trong nhiều cuộc trò chuyện đơn giản.",
    },
    {
      en: "I can use easy words first and then add more details later.",
      vi: "Tôi có thể dùng từ dễ trước rồi thêm nhiều chi tiết hơn sau.",
    },
  ];

  const byCategory: Record<string, SentencePair[]> = {
    "personal-life": [
      {
        en: `When I talk about ${topic}, I often share small details from my everyday life.`,
        vi: `Khi nói về ${viTopic}, tôi thường chia sẻ những chi tiết nhỏ trong cuộc sống hằng ngày.`,
      },
      {
        en: "These details make my story more natural and easier to understand.",
        vi: "Những chi tiết này làm câu chuyện của tôi tự nhiên hơn và dễ hiểu hơn.",
      },
      {
        en: "I also try to explain my feelings, not only the facts.",
        vi: "Tôi cũng cố gắng giải thích cảm xúc của mình, không chỉ nói sự việc.",
      },
    ],
    "work-study": [
      {
        en: `${label} is connected to my goals, my habits, and the way I improve every week.`,
        vi: `${label} liên quan đến mục tiêu, thói quen và cách tôi tiến bộ mỗi tuần.`,
      },
      {
        en: "Sometimes it is challenging, but it helps me become more disciplined.",
        vi: "Đôi khi việc đó khó khăn, nhưng nó giúp tôi trở nên kỷ luật hơn.",
      },
      {
        en: "I learn better when I make a clear plan and review my mistakes.",
        vi: "Tôi học tốt hơn khi lập kế hoạch rõ ràng và xem lại lỗi sai của mình.",
      },
    ],
    "real-life-situations": [
      {
        en: `${label} is a common situation, so I need clear and polite sentences.`,
        vi: `${label} là một tình huống phổ biến, nên tôi cần những câu rõ ràng và lịch sự.`,
      },
      {
        en: "I should listen carefully, ask short questions, and confirm important information.",
        vi: "Tôi nên lắng nghe cẩn thận, hỏi câu ngắn và xác nhận thông tin quan trọng.",
      },
      {
        en: "Practicing this topic helps me feel more confident in real life.",
        vi: "Luyện tập chủ đề này giúp tôi tự tin hơn trong đời sống thực tế.",
      },
    ],
    opinions: [
      {
        en: `In my opinion, ${topic} is interesting because people may have different ideas.`,
        vi: `Theo ý kiến của tôi, ${viTopic} rất thú vị vì mọi người có thể có suy nghĩ khác nhau.`,
      },
      {
        en: "I usually give one main reason and support it with a simple example.",
        vi: "Tôi thường đưa ra một lý do chính và bổ sung bằng một ví dụ đơn giản.",
      },
      {
        en: "A balanced answer is more convincing than a very extreme answer.",
        vi: "Một câu trả lời cân bằng sẽ thuyết phục hơn một câu trả lời quá cực đoan.",
      },
    ],
    "developer-tech": [
      {
        en: `${label} is part of modern technology work, especially for people who build web products.`,
        vi: `${label} là một phần của công việc công nghệ hiện đại, đặc biệt với những người xây dựng sản phẩm web.`,
      },
      {
        en: "Good communication is as important as technical skill in this topic.",
        vi: "Giao tiếp tốt cũng quan trọng như kỹ năng kỹ thuật trong chủ đề này.",
      },
      {
        en: "I try to solve problems step by step and keep the user experience in mind.",
        vi: "Tôi cố gắng giải quyết vấn đề từng bước và luôn nghĩ đến trải nghiệm người dùng.",
      },
    ],
  };

  return rotateSentences([...base, ...(byCategory[categoryId] ?? [])], `${label}-${Date.now()}`);
}

export function generateWritingPassage(options: GenerateOptions): GeneratedPassage | null {
  const topic = WRITING_TOPICS.find((item) => item.label === options.topicLabel);
  if (!topic) return null;

  const maxChars = options.direction === "vi_to_en" && options.lengthUnit === "chars"
    ? Math.min(options.lengthValue, 420)
    : options.lengthValue;
  const sentences = buildSentences(topic.label, topic.vietnamese, topic.categoryId);
  const trimmed = trimByLength(sentences, options.lengthUnit, maxChars);

  return {
    title: topic.label,
    text: trimmed.en,
    textVi: options.direction === "vi_to_en" ? trimmed.vi : "",
    wordCount: trimmed.en.split(/\s+/).filter(Boolean).length,
    source: "",
  };
}
