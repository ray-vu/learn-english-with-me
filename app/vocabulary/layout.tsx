import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Từ vựng",
  description: "Học từ vựng tiếng Anh theo chủ đề: động vật, ẩm thực, công nghệ, du lịch, kinh doanh và nhiều hơn nữa.",
};

export default function VocabularyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
