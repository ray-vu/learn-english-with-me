"use client";

import TopicSummary from "./TopicSummary";
import VocabularyHeader from "./VocabularyHeader";
import VocabularyResults from "./VocabularyResults";
import VocabularySidebar from "./VocabularySidebar";
import { useVocabulary } from "../hooks/useVocabulary";

export default function VocabularyScreen() {
  const vocabulary = useVocabulary();
  const {
    clearSearch, inputRef, isLoadingList, isLoadingWords, isReloading,
    loadTopic, panelState, query, reload, selectedTopic, selectTopic,
    skeletonCount, updateQuery, wordList, words,
  } = vocabulary;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <VocabularyHeader />
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <VocabularySidebar
          inputRef={inputRef}
          loadingSearch={isLoadingList}
          query={query}
          selectedTopic={selectedTopic}
          onClearSearch={clearSearch}
          onQueryChange={updateQuery}
          onTopicSelect={selectTopic}
        />

        <div className="min-w-0 flex-1">
          {selectedTopic && (
            <TopicSummary
              isLoadingWords={isLoadingWords}
              isReloading={isReloading}
              topic={selectedTopic}
              total={words.length}
              wordListTotal={wordList?.length ?? null}
              onReload={reload}
            />
          )}
          <VocabularyResults
            isLoadingWords={isLoadingWords}
            panelState={panelState}
            query={query}
            selectedTopic={selectedTopic}
            skeletonCount={skeletonCount}
            words={words}
            onRetry={() => selectedTopic && loadTopic(selectedTopic)}
          />
        </div>
      </div>
    </div>
  );
}
