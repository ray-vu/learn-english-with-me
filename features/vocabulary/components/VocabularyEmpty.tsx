export default function VocabularyEmpty() {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 text-center animate-fade-in">
      <div className="mb-3 text-4xl" aria-hidden="true">📚</div>
      <p className="font-medium text-slate-600">Chọn một chủ đề hoặc nhập từ khoá</p>
      <p className="mt-1 text-sm text-slate-400">để tra từ điển ngay lập tức</p>
    </div>
  );
}
