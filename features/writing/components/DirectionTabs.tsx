import { DIRECTION_TABS } from "../constants";
import type { Direction } from "../types";

interface Props {
  direction: Direction;
  disabled: boolean;
  onChange: (direction: Direction) => void;
}

export default function DirectionTabs({ direction, disabled, onChange }: Props) {
  return (
    <div
      className="mb-6 flex gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1"
      role="tablist"
      aria-label="Chiều dịch"
    >
      {DIRECTION_TABS.map((tab) => {
        const active = direction === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => !active && onChange(tab.value)}
            disabled={disabled}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "border border-indigo-100 bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <span className="mr-2" aria-hidden="true">{tab.flag}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
