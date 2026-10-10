import { Bot, Target, TrendingUp } from "lucide-react";

export default function AICareerAdvisor({ data }) {
  if (!data) return null;
  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25 relative overflow-hidden">
      
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5 text-[#ffd159]" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Career Advisor</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
        
        {/* Left Side: Content */}
        <div className="flex-1 pr-4">
          <p className="text-sm leading-relaxed text-slate-300">
            {data.ai_advice}
          </p>
        </div>

        {/* Right Side: Metric Boxes */}
        <div className="flex flex-col gap-3 w-full md:w-72 shrink-0">
          <div className="rounded-2xl border border-white/[0.06] bg-[#242730] p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#ffd159]/10 text-[#ffd159]"><Target className="h-4 w-4" /></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Focus Area</span>
            </div>
            <span className="text-sm font-bold text-white leading-tight">{data.ai_focus_area}</span>
          </div>
          
          <div className="rounded-2xl border border-white/[0.06] bg-[#242730] p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#4ee4cb]/10 text-[#4ee4cb]"><TrendingUp className="h-4 w-4" /></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Potential Improvement</span>
            </div>
            <span className="text-sm font-bold text-[#4ee4cb]">{data.ai_potential_improvement}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
