import type { RefObject } from "react";
import TopicList from "./TopicList";
import VocabularySearch from "./VocabularySearch";
import type { Topic } from "../types";

interface Props {
  inputRef: RefObject<HTMLInputElement | null>;
  loadingSearch: boolean;
  query: string;
  selectedTopic: Topic | null;
  onClearSearch: () => void;
  onQueryChange: (value: string) => void;
  onTopicSelect: (topic: Topic) => void;
}

export default function VocabularySidebar(props: Props) {
  return (
    <div className="w-full flex-shrink-0 space-y-3 lg:w-72 lg:space-y-4 xl:w-80">
      <VocabularySearch
        inputRef={props.inputRef}
        loading={props.loadingSearch}
        query={props.query}
        onChange={props.onQueryChange}
        onClear={props.onClearSearch}
      />
      <TopicList
        selectedTopic={props.selectedTopic}
        onSelect={props.onTopicSelect}
      />
    </div>
  );
}
