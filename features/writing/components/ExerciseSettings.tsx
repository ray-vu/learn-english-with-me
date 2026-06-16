import { RefreshCw, SlidersHorizontal } from "lucide-react";
import TopicPicker from "./TopicPicker";
import type { PassageLengthUnit, WritingTopicGroup } from "../types";

interface Props {
  activeMax: number;
  canGenerate: boolean;
  disabled: boolean;
  isLoading: boolean;
  lengthUnit: PassageLengthUnit;
  lengthValue: number;
  limits: { min: number; max: number; step: number };
  selectedTopic: string;
  topicGroups: WritingTopicGroup[];
  onGenerate: () => void;
  onLengthBlur: () => void;
  onLengthChange: (value: number) => void;
  onUnitChange: (unit: PassageLengthUnit) => void;
  onTopicChange: (topic: string) => void;
}

export default function ExerciseSettings(props: Props) {
  const { activeMax, canGenerate, disabled, isLoading, lengthUnit, lengthValue, limits,
    selectedTopic, topicGroups, onGenerate, onLengthBlur,
    onLengthChange, onUnitChange, onTopicChange } = props;

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex items-center gap-2 lg:w-36 lg:flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
            <SlidersHorizontal className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">Thiết lập bài</div>
            <div className="text-xs text-slate-400">Cho bài mới</div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-[minmax(110px,140px)_minmax(100px,120px)_1fr] lg:grid-cols-[130px_110px_auto]">
          <select
            value={lengthUnit}
            onChange={(event) => onUnitChange(event.target.value as PassageLengthUnit)}
            disabled={disabled}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 sm:text-sm"
            aria-label="Đơn vị độ dài bài dịch"
          >
            <option value="chars">Ký tự</option>
            <option value="lines">Dòng</option>
          </select>
          <input
            type="number"
            value={lengthValue}
            min={limits.min}
            max={activeMax}
            step={limits.step}
            onChange={(event) => onLengthChange(Number(event.target.value))}
            onBlur={onLengthBlur}
            disabled={disabled}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 sm:text-sm"
            aria-label="Độ dài bài dịch"
          />
          <button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="col-span-2 flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-3 lg:col-span-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
            Tạo bài
          </button>
        </div>
      </div>
      <div className="mt-3">
        <TopicPicker
          disabled={disabled}
          groups={topicGroups}
          selectedTopic={selectedTopic}
          onTopicChange={onTopicChange}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        {!selectedTopic
          ? "Chọn một topic để bật nút Tạo bài."
          : lengthUnit === "lines"
            ? "Mỗi dòng tương ứng một câu nội dung; số dòng hiển thị thực tế còn phụ thuộc kích thước màn hình."
            : `Giới hạn hiện tại: ${limits.min}-${activeMax} ký tự.`}
      </p>
    </div>
  );
}
