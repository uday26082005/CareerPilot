import { Bot, RefreshCcw, Target, Calendar, TrendingUp } from "lucide-react";

export default function AICareerAdvisor() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md relative overflow-hidden">
      
      <div className="flex items-center gap-2 mb-3">
        <Bot className="h-5 w-5 text-violet-400" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">AI Career Advisor</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
        
        {/* Left Side: Content */}
        <div className="flex-1 pr-4">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-300">
            If I were you, I'd recommend focusing on improving your backend and cloud skills. 
            Spend the next 4 weeks learning Docker and AWS, build a full-stack deployment project, 
            and practice backend mock interviews.
          </p>
          
          <button className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors mt-8">
            <RefreshCcw className="h-4 w-4" /> Regenerate Advice
          </button>
        </div>

        {/* Right Side: Metric Boxes */}
        <div className="flex flex-col gap-2.5 w-full md:w-72 shrink-0">
          <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/20 text-blue-400"><Target className="h-4 w-4" /></div>
              <span className="text-xs text-slate-400 dark:text-gray-500">Focus Area</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Backend Development & Cloud</span>
          </div>
          
          <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/20 text-emerald-400"><TrendingUp className="h-4 w-4" /></div>
              <span className="text-xs text-slate-400 dark:text-gray-500">Potential Improvement</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">8 - 12% match increase</span>
          </div>
        </div>

      </div>



    </div>
  );
}
