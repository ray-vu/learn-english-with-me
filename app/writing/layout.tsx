import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luyện viết",
  description: "Luyện kỹ năng dịch thuật tiếng Anh ↔ Việt với các bài tập thực tế từ cơ bản đến nâng cao.",
};

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
