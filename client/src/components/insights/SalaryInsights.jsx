import { Info, ArrowRight, CheckCircle2, TrendingUp, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export default function SalaryInsights() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md">
      
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
          Salary Insights (India) <Info className="h-4 w-4" />
        </h3>
      </div>

      <div className="flex-1 grid grid-cols-3 divide-x divide-white/5">
        {/* Entry Level */}
        <div className="flex flex-col pr-4 justify-center">
          <div className="flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Entry Level</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">₹4 - 8 LPA</h4>
          <span className="text-xs text-slate-400 dark:text-gray-500">0 - 2 years</span>
        </div>

        {/* Mid Level */}
        <div className="flex flex-col px-4 justify-center">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="h-4 w-4 text-pink-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Mid Level</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">₹10 - 18 LPA</h4>
          <span className="text-xs text-slate-400 dark:text-gray-500">2 - 5 years</span>
        </div>

        {/* Senior Level */}
        <div className="flex flex-col pl-4 justify-center">
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Senior Level</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">₹25 - 40 LPA</h4>
          <span className="text-xs text-slate-400 dark:text-gray-500">5+ years</span>
        </div>

      </div>
      
    </div>
  );
}
