import WordCard from "./WordCard";
import WordSkeleton from "./WordSkeleton";
import type { VocabularyEntry } from "../types";

interface Props {
  loading: boolean;
  skeletonCount: number;
  words: VocabularyEntry[];
}

export default function WordGrid({ loading, skeletonCount, words }: Props) {
  return (
    <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
      {words.map((entry, index) => (
        <WordCard key={entry.english} entry={entry} index={index} />
      ))}
      {loading && Array.from({ length: Math.min(skeletonCount, 12) }).map((_, index) => (
        <WordSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
