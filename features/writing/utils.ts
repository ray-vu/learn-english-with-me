import { LENGTH_LIMITS } from "./constants";
import type { Direction, PassageLengthUnit } from "./types";

export function clampLength(
  value: number,
  unit: PassageLengthUnit,
  direction: Direction
): number {
  const limits = LENGTH_LIMITS[unit];
  const max = unit === "chars" && direction === "vi_to_en" ? 420 : limits.max;
  return Math.min(max, Math.max(limits.min, Math.round(value)));
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981";
  if (score >= 50) return "#3b82f6";
  if (score >= 35) return "#f59e0b";
  return "#ef4444";
}

export function getGradeEmoji(score: number): string {
  if (score >= 88) return "🌟";
  if (score >= 75) return "👍";
  if (score >= 60) return "📝";
  if (score >= 45) return "💪";
  return "📚";
}

export function getScoreMessage(score: number): string {
  if (score >= 75) return "Tuyệt vời! Bạn đã nắm bắt ý nghĩa của đoạn văn rất tốt.";
  if (score >= 55) return "Cố gắng tốt! Hãy so sánh với bản dịch tham khảo để cải thiện thêm.";
  return "Đừng nản lòng — luyện tập thêm sẽ giúp bạn tiến bộ nhanh!";
}
