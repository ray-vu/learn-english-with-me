export default function HintsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="mb-3 h-2.5 w-28 rounded-full bg-slate-100" />
        <div className="flex flex-wrap gap-2">
          {[72, 88, 64, 80, 76, 68].map((width, index) => (
            <div key={index} className="h-14 rounded-xl bg-slate-100" style={{ width }} />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 h-2.5 w-32 rounded-full bg-slate-100" />
        <div className="space-y-2.5">
          {[1, 2, 3].map((item) => <div key={item} className="h-16 rounded-xl bg-slate-100" />)}
        </div>
      </div>
    </div>
  );
}
