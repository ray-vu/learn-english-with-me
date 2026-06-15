import { topics } from "@/lib/vocabulary-data";
import TopicButton from "./TopicButton";
import type { Topic } from "../types";

interface Props {
  selectedTopic: Topic | null;
  onSelect: (topic: Topic) => void;
}

export default function TopicList({ selectedTopic, onSelect }: Props) {
  return (
    <nav aria-label="Chủ đề từ vựng" className="-mx-4 px-4 lg:mx-0 lg:px-0">
      <div className="mb-2 flex items-center justify-between lg:hidden">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Chủ đề</span>
        <span className="text-xs text-slate-400">Vuốt để xem thêm</span>
      </div>
      <ul
        className="scrollbar-thin flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0"
      >
        {topics.map((topic) => (
          <li key={topic.id} className="w-40 flex-shrink-0 lg:w-auto">
            <TopicButton
              topic={topic}
              active={selectedTopic?.id === topic.id}
              onClick={() => onSelect(topic)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
