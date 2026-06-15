import { BarChart3, CheckCircle, RefreshCw } from "lucide-react";
import ReferenceTranslation from "./ReferenceTranslation";
import ScoreBar from "./ScoreBar";
import ScoreRing from "./ScoreRing";
import type { Direction, ScoreResult } from "../types";
import { getGradeEmoji, getScoreColor, getScoreMessage } from "../utils";

interface Props {
  direction: Direction;
  result: ScoreResult;
  onReset: () => void;
}

export default function ScoreCard({ direction, result, onReset }: Props) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-fade-in-up"
      aria-label="Kết quả chấm điểm"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
        <BarChart3 className="h-4 w-4 text-indigo-500" aria-hidden="true" />
        <span className="text-sm font-semibold text-slate-800">Kết quả chấm điểm</span>
      </div>

      <div className="p-5">
        <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row">
          <ScoreRing score={result.total} color={result.gradeColor} />
          <div className="text-center sm:text-left">
            <div className="mb-1 flex items-center justify-center gap-2 sm:justify-start">
              <span className="text-2xl font-bold" style={{ color: result.gradeColor }}>{result.grade}</span>
              <span className="text-xl">{getGradeEmoji(result.total)}</span>
            </div>
            <p className="max-w-xs text-sm text-slate-500">{getScoreMessage(result.total)}</p>
          </div>
        </div>

        <div className="mb-5 space-y-3">
          {result.hasReference && (
            <ScoreBar
              label="Độ chính xác từ vựng"
              score={result.scores.similarity}
              color={getScoreColor(result.scores.similarity)}
            />
          )}
          <ScoreBar label="Độ đầy đủ nội dung" score={result.scores.length} color={getScoreColor(result.scores.length)} />
          <ScoreBar label="Ngữ pháp & chính tả" score={result.scores.grammar} color={getScoreColor(result.scores.grammar)} />
        </div>

        {result.feedback.length > 0 && (
          <ul className="mb-5 space-y-1.5">
            {result.feedback.map((message) => (
              <li key={message} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-400" aria-hidden="true" />
                {message}
              </li>
            ))}
          </ul>
        )}
        {result.hasReference && result.reference && (
          <ReferenceTranslation direction={direction} reference={result.reference} />
        )}
      </div>

      <div className="flex px-5 pb-5">
        <button
          onClick={onReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-500 hover:to-purple-500"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Bài mới
        </button>
      </div>
    </section>
  );
}
