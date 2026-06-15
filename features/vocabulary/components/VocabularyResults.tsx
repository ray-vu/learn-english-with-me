import VocabularyEmpty from "./VocabularyEmpty";
import VocabularyError from "./VocabularyError";
import VocabularyLoading from "./VocabularyLoading";
import WordGrid from "./WordGrid";
import type { PanelState, Topic, VocabularyEntry } from "../types";

interface Props {
  isLoadingWords: boolean;
  panelState: PanelState;
  query: string;
  selectedTopic: Topic | null;
  skeletonCount: number;
  words: VocabularyEntry[];
  onRetry: () => void;
}

export default function VocabularyResults({
  isLoadingWords,
  panelState,
  query,
  selectedTopic,
  skeletonCount,
  words,
  onRetry,
}: Props) {
  return (
    <div aria-live="polite" aria-atomic="false">
      {panelState.mode === "idle" && <VocabularyEmpty />}
      {panelState.mode === "loading-list" && <VocabularyLoading />}
      {panelState.mode === "error" && (
        <div className="animate-fade-in">
          <VocabularyError
            message={panelState.message}
            onRetry={selectedTopic ? onRetry : undefined}
          />
        </div>
      )}
      {(isLoadingWords || panelState.mode === "ready") && (
        <WordGrid
          loading={isLoadingWords}
          skeletonCount={skeletonCount}
          words={words}
        />
      )}
      {query && panelState.mode === "ready" && words.length > 0 && (
        <div className="mt-4 text-center text-xs text-slate-400">
          Kết quả tra từ{" "}
          <span className="font-semibold text-slate-600">&ldquo;{query}&rdquo;</span>
        </div>
      )}
    </div>
  );
}
