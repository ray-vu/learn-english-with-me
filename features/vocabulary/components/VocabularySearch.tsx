import type { RefObject } from "react";
import { Loader2, Search, X } from "lucide-react";

interface Props {
  inputRef: RefObject<HTMLInputElement | null>;
  loading: boolean;
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function VocabularySearch({
  inputRef,
  loading,
  query,
  onChange,
  onClear,
}: Props) {
  const Icon = loading && query ? Loader2 : Search;

  return (
    <div className="relative">
      <Icon
        className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
          loading && query ? "animate-spin text-indigo-400" : "text-slate-400"
        }`}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tra từ bất kỳ… (vd: resilient)"
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-900 shadow-sm transition-all placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        aria-label="Tra từ vựng"
        autoComplete="off"
        spellCheck="false"
      />
      {query && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          aria-label="Xóa tìm kiếm"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
