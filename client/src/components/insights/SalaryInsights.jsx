import { Info, CheckCircle2, TrendingUp, Trophy } from "lucide-react";

export default function SalaryInsights({ data }) {
  if (!data) return null;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          Salary Insights (India) <Info className="h-4 w-4 text-slate-500" />
        </h3>
      </div>

      <div className="flex-1 grid grid-cols-3 divide-x divide-white/[0.08]">
        {/* Entry Level */}
        <div className="flex flex-col pr-4 justify-center">
          <div className="flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="h-4 w-4 text-[#4ee4cb]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Entry Level</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-1">{data.salary_entry}</h4>
          <span className="text-xs text-slate-400">0 - 2 years</span>
        </div>

        {/* Mid Level */}
        <div className="flex flex-col px-4 justify-center">
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingUp className="h-4 w-4 text-[#ffd159]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mid Level</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-1">{data.salary_mid}</h4>
          <span className="text-xs text-slate-400">2 - 5 years</span>
        </div>

        {/* Senior Level */}
        <div className="flex flex-col pl-4 justify-center">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Trophy className="h-4 w-4 text-[#e29aff]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Senior Level</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-1">{data.salary_senior}</h4>
          <span className="text-xs text-slate-400">5+ years</span>
        </div>

      </div>
      
    </div>
  );
}
