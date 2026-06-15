import type { HintsData } from "../types";

export default function HintsContent({
  hints,
  isViToEn,
}: {
  hints: HintsData;
  isViToEn: boolean;
}) {
  return (
    <div className="space-y-5">
      {hints.vocab.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {isViToEn ? "Từ vựng có thể dùng" : "Từ quan trọng"}
          </p>
          <div className="flex flex-wrap gap-2">
            {hints.vocab.map((item) => (
              <div
                key={`${item.word}-${item.translation}`}
                className="flex cursor-default flex-col items-start rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <span className="text-sm font-semibold leading-tight text-slate-800">{item.word}</span>
                {item.translation && (
                  <span className="mt-0.5 text-[11px] leading-tight text-indigo-500">{item.translation}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hints.phrases.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {isViToEn ? "Cấu trúc tham khảo" : "Cụm từ gợi ý"}
          </p>
          <div className="space-y-2">
            {hints.phrases.map((item) => (
              <div
                key={`${item.phrase}-${item.translation}`}
                className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-3.5 py-2.5"
              >
                <p className="text-[13px] font-medium leading-snug text-slate-700">
                  &ldquo;{item.phrase}&rdquo;
                </p>
                {item.translation && (
                  <p className="mt-1 text-[11px] leading-snug text-indigo-500">{item.translation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
