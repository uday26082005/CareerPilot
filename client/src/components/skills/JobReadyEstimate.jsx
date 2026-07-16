import { Clock, Briefcase, ArrowRight } from "lucide-react";

export default function JobReadyEstimate() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <Briefcase className="h-6 w-6 text-violet-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Estimated Time to Become<br/>Job Ready</h3>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Clock className="h-10 w-10 text-violet-500" />
          <div>
            <span className="block text-4xl font-black text-violet-400 tracking-tight">12-16</span>
            <span className="text-sm font-semibold text-violet-300">Weeks</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-gray-400 mb-8">Consistency is the key!</p>
      </div>

      <button className="relative z-10 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-3 text-xs font-bold text-slate-900 dark:text-white transition-all hover:bg-violet-500 hover:scale-[1.02] shadow-lg shadow-violet-500/25">
        Generate Personalized Roadmap <ArrowRight className="h-4 w-4" />
      </button>
      
    </div>
  );
}
