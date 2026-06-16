import { Check, Tag } from "lucide-react";
import type { WritingTopicGroup } from "../types";

interface Props {
  disabled: boolean;
  groups: WritingTopicGroup[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export default function TopicPicker({ disabled, groups, selectedTopic, onTopicChange }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
            <Tag className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800">Chọn topic</div>
            <div className="truncate text-xs text-slate-400">
              {selectedTopic || "Bắt buộc để tạo bài writing"}
            </div>
          </div>
        </div>
        <span className="flex-shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm">
          {groups.reduce((total, group) => total + group.topics.length, 0)} topic
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible xl:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="min-w-[250px] rounded-xl bg-white p-3 shadow-sm lg:min-w-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.topics.map((topic) => {
                const active = topic.label === selectedTopic;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => onTopicChange(topic.label)}
                    disabled={disabled}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition ${
                      active
                        ? "border-indigo-200 bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {active && <Check className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />}
                    <span>{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
