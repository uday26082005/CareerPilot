import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function TopStrengths({ strengths }) {
  const displayedStrengths = strengths && strengths.length > 0 ? strengths : [];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25 relative overflow-hidden">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#4ee4cb]" /> Top Strengths
      </h3>
      
      <div className="relative z-10 flex flex-col gap-2.5">
        {displayedStrengths.length > 0 ? (
          displayedStrengths.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#242730] px-3.5 py-2.5 transition-all hover:bg-[#2b2f3a] hover:border-white/10 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-[#4ee4cb] shrink-0 stroke-[2.5]" />
              <span className="text-sm font-medium text-white">{item}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3 text-sm text-slate-400 py-4 justify-center">
            No strengths identified yet.
          </div>
        )}
      </div>

    </div>
  );
}
