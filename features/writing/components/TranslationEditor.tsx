import type { RefObject } from "react";
import { BarChart3, Loader2, PenLine } from "lucide-react";
import type { Direction, PageState } from "../types";

interface Props {
  canScore: boolean;
  direction: Direction;
  pageState: PageState;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  userText: string;
  wordCount: number;
  onChange: (value: string) => void;
  onClear: () => void;
  onScore: () => void;
}

export default function TranslationEditor(props: Props) {
  const { canScore, direction, pageState, textareaRef, userText, wordCount,
    onChange, onClear, onScore } = props;
  const scoring = pageState === "scoring";
  const disabled = pageState === "loading" || scoring || pageState === "scored";

  return (
    <>
      <section aria-labelledby="writing-heading">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="writing-heading" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <PenLine className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            Bản dịch của bạn
          </h2>
          <div className="flex items-center gap-3">
            {wordCount > 0 && <span className="text-xs text-slate-400">{wordCount} từ</span>}
            {(pageState === "ready" || pageState === "scored") && userText && (
              <button onClick={onClear} className="text-xs text-slate-400 transition hover:text-rose-500">
                Xóa
              </button>
            )}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={userText}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={direction === "vi_to_en"
            ? "Write your English translation here…"
            : "Viết bản dịch tiếng Việt của bạn tại đây…"}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-relaxed text-slate-900 shadow-sm transition placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          rows={7}
          lang={direction === "vi_to_en" ? "en" : "vi"}
        />
      </section>

      {pageState !== "scored" && (
        <button
          onClick={onScore}
          disabled={!canScore || scoring}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          {scoring
            ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Đang chấm…</>
            : <><BarChart3 className="h-4 w-4" aria-hidden="true" /> Chấm điểm</>}
        </button>
      )}
    </>
  );
}
