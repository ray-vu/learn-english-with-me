import Link from "next/link";
import { BookOpen, PenLine, ArrowRight, Zap, Target, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] px-4 py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          Học tiếng Anh hiệu quả
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
          Nâng cao tiếng Anh{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            mỗi ngày
          </span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          Khám phá từ vựng theo chủ đề và luyện kỹ năng dịch thuật với bài tập thực tế, được thiết kế để giúp bạn tiến bộ nhanh nhất.
        </p>

        {/* CTA Cards */}
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link
            href="/vocabulary"
            className="group relative flex flex-col items-start gap-3 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
              <BookOpen className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900 mb-1">Học từ vựng</div>
              <div className="text-sm text-slate-500">8 chủ đề · 64+ từ vựng với ví dụ thực tế</div>
            </div>
            <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-200" aria-hidden="true" />
          </Link>

          <Link
            href="/writing"
            className="group relative flex flex-col items-start gap-3 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-sm">
              <PenLine className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-900 mb-1">Luyện viết</div>
              <div className="text-sm text-slate-500">6 bài tập · Dịch Việt↔Anh đa cấp độ</div>
            </div>
            <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-200" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto w-full animate-fade-in-up stagger-3">
        {[
          { icon: Target, title: "Chủ đề đa dạng", desc: "Từ động vật đến kinh tế, công nghệ" },
          { icon: Trophy, title: "3 cấp độ", desc: "Cơ bản, trung cấp, nâng cao" },
          { icon: Zap, title: "Phản hồi ngay", desc: "So sánh bản dịch gợi ý tức thì" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 rounded-xl bg-white/60 border border-slate-200/80 p-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Icon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">{title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
