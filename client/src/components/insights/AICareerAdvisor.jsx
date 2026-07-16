import { Bot, RefreshCcw, Target, Calendar, TrendingUp } from "lucide-react";

export default function AICareerAdvisor() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md relative overflow-hidden">
      
      <div className="flex items-center gap-2 mb-6">
        <Bot className="h-4 w-4 text-violet-400" />
        <h3 className="text-[11px] font-semibold text-slate-900 dark:text-white">AI Career Advisor</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start flex-1">
        
        {/* Avatar */}
        <div className="relative shrink-0 mt-2">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-900 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <Bot className="h-10 w-10 text-slate-900 dark:text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between h-full">
          <div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-gray-300 mb-4">
              If I were you, I'd recommend focusing on improving your backend and cloud skills. 
              Spend the next 4 weeks learning Docker and AWS, build a full-stack deployment project, 
              and practice backend mock interviews.
            </p>
            <p className="text-[11px] font-medium text-violet-400 mb-6">
              This could increase your career match by 8 - 12%.
            </p>
          </div>

          {/* Metric Boxes */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-blue-400"><Target className="h-3 w-3" /></div>
                <span className="text-[9px] text-slate-400 dark:text-gray-500">Focus Area</span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight">Backend Development<br/>& Cloud</span>
            </div>
            
            <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-violet-500/20 text-violet-400"><Calendar className="h-3 w-3" /></div>
                <span className="text-[9px] text-slate-400 dark:text-gray-500">Recommended Time</span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 dark:text-white">4 Weeks</span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400"><TrendingUp className="h-3 w-3" /></div>
                <span className="text-[9px] text-slate-400 dark:text-gray-500">Potential Improvement</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">8 - 12%<br/>match increase</span>
            </div>
          </div>
        </div>

      </div>

      <button className="absolute bottom-6 left-6 flex items-center gap-1.5 text-[10px] font-medium text-violet-400 hover:text-violet-300 transition-colors">
        <RefreshCcw className="h-3 w-3" /> Regenerate Advice
      </button>

    </div>
  );
}
