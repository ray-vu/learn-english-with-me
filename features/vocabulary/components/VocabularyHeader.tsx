import { BookOpen } from "lucide-react";

export default function VocabularyHeader() {
  return (
    <div className="mb-6">
      <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        <span>Học từ vựng</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Từ vựng theo chủ đề</h1>
      <p className="mt-1 text-sm text-slate-500">
        Chọn chủ đề để học từ thông dụng, hoặc tra bất kỳ từ nào
      </p>
    </div>
  );
}
