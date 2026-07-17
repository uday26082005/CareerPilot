import { Users, Target, TrendingUp, TrendingDown } from "lucide-react";

export default function InterviewProgress() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-base font-semibold text-slate-500 dark:text-gray-400">Your Interview Progress</h3>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Card 1 */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-4 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">Interviews Taken</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-4 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">Avg. Score</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">78%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
