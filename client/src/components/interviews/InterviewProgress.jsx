import { Users, Target, TrendingUp, TrendingDown } from "lucide-react";

export default function InterviewProgress() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-sm font-semibold text-gray-400">Your Interview Progress</h3>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Card 1 */}
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0a0c1a] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400">Interviews Taken</p>
            <p className="text-lg font-bold text-white">12</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0a0c1a] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400">Avg. Score</p>
            <p className="text-lg font-bold text-white">78%</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0a0c1a] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400">Strong Areas</p>
            <p className="text-lg font-bold text-white">5</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0a0c1a] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400">Areas to Improve</p>
            <p className="text-lg font-bold text-white">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
