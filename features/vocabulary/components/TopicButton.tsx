import type { Topic } from "../types";

interface Props {
  active: boolean;
  topic: Topic;
  onClick: () => void;
}

export default function TopicButton({ active, topic, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Chủ đề: ${topic.title} (${topic.titleVi})`}
      className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-150 lg:gap-3 lg:p-3 ${
        active
          ? `bg-gradient-to-r ${topic.gradient} border-transparent text-white shadow-sm`
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className="flex-shrink-0 text-lg lg:text-xl" role="img" aria-hidden="true">
        {topic.icon}
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{topic.title}</div>
        <div className={`truncate text-xs ${active ? "text-white/80" : "text-slate-400"}`}>
          {topic.titleVi}
        </div>
      </div>
    </button>
  );
}
