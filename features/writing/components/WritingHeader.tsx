import { PenLine } from "lucide-react";
import { DIRECTION_TABS } from "../constants";
import type { Direction } from "../types";

export default function WritingHeader({ direction }: { direction: Direction }) {
  const hint = DIRECTION_TABS.find((tab) => tab.value === direction)?.hint;

  return (
    <div className="mb-5">
      <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
        <PenLine className="h-4 w-4" aria-hidden="true" />
        <span>Luyện viết</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Luyện dịch thuật</h1>
      <p className="mt-1 text-sm text-slate-500">
        {hint} — AI sẽ chấm điểm bản dịch của bạn
      </p>
    </div>
  );
}
