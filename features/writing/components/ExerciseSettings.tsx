import { RefreshCw, SlidersHorizontal, Tag } from "lucide-react";
import type { PassageLengthUnit, WritingTopic } from "../types";

interface Props {
  activeMax: number;
  canGenerate: boolean;
  disabled: boolean;
  isLoading: boolean;
  lengthUnit: PassageLengthUnit;
  lengthValue: number;
  limits: { min: number; max: number; step: number };
  selectedTopic: string;
  topics: WritingTopic[];
  topicsLoading: boolean;
  onGenerate: () => void;
  onLengthBlur: () => void;
  onLengthChange: (value: number) => void;
  onUnitChange: (unit: PassageLengthUnit) => void;
  onTopicChange: (topic: string) => void;
}

export default function ExerciseSettings(props: Props) {
  const { activeMax, canGenerate, disabled, isLoading, lengthUnit, lengthValue, limits,
    selectedTopic, topics, topicsLoading, onGenerate, onLengthBlur,
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

        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-[minmax(180px,1fr)_minmax(110px,140px)_minmax(100px,120px)] lg:grid-cols-[minmax(180px,1fr)_130px_110px_auto]">
          <label className="col-span-2 min-w-0 sm:col-span-1">
            <span className="sr-only">Chủ đề bài dịch</span>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <select
                value={selectedTopic}
                onChange={(event) => onTopicChange(event.target.value)}
                disabled={topicsLoading || disabled}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
              >
                <option value="">{topicsLoading ? "Đang tải chủ đề..." : "Chọn chủ đề bắt buộc"}</option>
                {topics.map((topic) => <option key={topic.id} value={topic.label}>{topic.label}</option>)}
              </select>
            </div>
          </label>
          <select
            value={lengthUnit}
            onChange={(event) => onUnitChange(event.target.value as PassageLengthUnit)}
            disabled={disabled}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
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
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
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
      <p className="mt-2 text-xs text-slate-400">
        {!selectedTopic
          ? "Chọn một chủ đề tiếng Anh từ Wikipedia để bật nút Tạo bài."
          : lengthUnit === "lines"
            ? "Mỗi dòng tương ứng một câu nội dung; số dòng hiển thị thực tế còn phụ thuộc kích thước màn hình."
            : `Giới hạn hiện tại: ${limits.min}-${activeMax} ký tự.`}
      </p>
    </div>
  );
}
