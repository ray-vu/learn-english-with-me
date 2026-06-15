import { Loader2 } from "lucide-react";

export default function VocabularyLoading() {
  return (
    <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white text-center animate-fade-in">
      <Loader2 className="mb-3 h-8 w-8 animate-spin text-indigo-400" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-600">Đang tải danh sách từ…</p>
    </div>
  );
}
