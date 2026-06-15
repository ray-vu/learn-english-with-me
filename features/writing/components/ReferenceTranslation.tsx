"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import type { Direction } from "../types";

interface Props {
  direction: Direction;
  reference: string;
}

export default function ReferenceTranslation({ direction, reference }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          {direction === "vi_to_en" ? "Bản gốc tiếng Anh" : "Bản dịch tham khảo"}
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
          : <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />}
      </button>
      {open && (
        <div className="bg-white px-4 py-3 animate-fade-in">
          <p className="text-sm italic leading-relaxed text-slate-700">&ldquo;{reference}&rdquo;</p>
          <p className="mt-2 text-[11px] text-slate-400">
            * Tham khảo từ MyMemory — không phải bản dịch chuẩn tuyệt đối
          </p>
        </div>
      )}
    </div>
  );
}
