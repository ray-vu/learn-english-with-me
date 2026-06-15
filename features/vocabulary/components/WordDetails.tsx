import { BookOpen, Lightbulb } from "lucide-react";
import type { VocabularyEntry } from "../types";

export default function WordDetails({ entry }: { entry: VocabularyEntry }) {
  return (
    <div className="mx-4 mt-3 space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-3 animate-fade-in">
      {entry.definition && (
        <div className="flex items-start gap-2">
          <BookOpen className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-slate-600">{entry.definition}</p>
        </div>
      )}
      {entry.example && (
        <div className="flex items-start gap-2 border-t border-slate-200 pt-2">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" aria-hidden="true" />
          <div className="min-w-0 space-y-1">
            <p className="text-xs italic leading-relaxed text-slate-700">
              &ldquo;{entry.example}&rdquo;
            </p>
            {entry.exampleVi && (
              <p className="text-xs leading-relaxed text-slate-400">{entry.exampleVi}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
