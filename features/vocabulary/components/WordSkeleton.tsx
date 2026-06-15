export default function WordSkeleton() {
  return (
    <div className="relative flex min-h-[188px] h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
      <div className="absolute inset-y-0 left-0 w-1 bg-slate-100" />
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-28 rounded bg-slate-200" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <div className="h-3 w-16 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
      </div>
      <div className="mt-auto pt-4">
        <div className="h-3 w-24 rounded bg-slate-100" />
      </div>
    </div>
  );
}
