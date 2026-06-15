"use client";

import DirectionTabs from "./DirectionTabs";
import ExerciseSettings from "./ExerciseSettings";
import HintsPanel from "./HintsPanel";
import PassageCard from "./PassageCard";
import ScoreCard from "./ScoreCard";
import TranslationEditor from "./TranslationEditor";
import WritingError from "./WritingError";
import WritingHeader from "./WritingHeader";
import { useWritingExercise } from "../hooks/useWritingExercise";

export default function WritingScreen() {
  const exercise = useWritingExercise();
  const {
    activeLengthMax, canGenerate, canScore, changeDirection, changeLengthUnit,
    changeTopic, clearTranslation, direction, errorMsg, hints, hintsLoading,
    isBusy, isLoading, lengthUnit, lengthValue, limits, loadPassage, normalizeLength,
    pageState, passage, scoreRef, scoreResult, scoreTranslation, selectedTopic,
    setLengthValue, setUserText, textareaRef, topics, topicsLoading, userText,
    wordCount,
  } = exercise;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <WritingHeader direction={direction} />
      <DirectionTabs direction={direction} disabled={isBusy} onChange={changeDirection} />
      <ExerciseSettings
        activeMax={activeLengthMax}
        canGenerate={canGenerate}
        disabled={isBusy}
        isLoading={isLoading}
        lengthUnit={lengthUnit}
        lengthValue={lengthValue}
        limits={limits}
        selectedTopic={selectedTopic}
        topics={topics}
        topicsLoading={topicsLoading}
        onGenerate={loadPassage}
        onLengthBlur={normalizeLength}
        onLengthChange={setLengthValue}
        onTopicChange={changeTopic}
        onUnitChange={changeLengthUnit}
      />

      <div className="lg:grid lg:grid-cols-[1fr_268px] lg:items-start lg:gap-6">
        <div className="space-y-5">
          <WritingError
            message={errorMsg}
            canRetry={Boolean(selectedTopic)}
            onRetry={loadPassage}
          />
          <PassageCard
            canGenerate={canGenerate}
            direction={direction}
            pageState={pageState}
            passage={passage}
            selectedTopic={selectedTopic}
            onReset={loadPassage}
          />
          {(hints || hintsLoading) && (
            <div className="lg:hidden">
              <HintsPanel
                collapsible
                direction={direction}
                hints={hints}
                loading={hintsLoading}
              />
            </div>
          )}
          <TranslationEditor
            canScore={canScore}
            direction={direction}
            pageState={pageState}
            textareaRef={textareaRef}
            userText={userText}
            wordCount={wordCount}
            onChange={setUserText}
            onClear={clearTranslation}
            onScore={scoreTranslation}
          />
          {pageState === "scored" && scoreResult && (
            <div ref={scoreRef}>
              <ScoreCard
                direction={direction}
                result={scoreResult}
                onReset={loadPassage}
              />
            </div>
          )}
        </div>

        <aside className="hidden lg:sticky lg:top-20 lg:block">
          <HintsPanel direction={direction} hints={hints} loading={hintsLoading} />
        </aside>
      </div>
    </div>
  );
}
