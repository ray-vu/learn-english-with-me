import { AlertCircle } from "lucide-react";

interface Props {
  message: string;
  canRetry: boolean;
  onRetry: () => void;
}

export default function WritingError({ message, canRetry, onRetry }: Props) {
  if (!message) return null;

  return (
    <div
      className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-fade-in"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      {canRetry && (
        <button onClick={onRetry} className="flex-shrink-0 font-medium underline hover:no-underline">
          Thử lại
        </button>
      )}
    </div>
  );
}
