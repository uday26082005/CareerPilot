import { Info, ArrowRight, CheckCircle2, TrendingUp, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export default function SalaryInsights() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
          Salary Insights (India) <Info className="h-3 w-3" />
        </h3>
        <select className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md px-2 py-1 text-[10px] font-medium text-slate-600 dark:text-gray-300 focus:outline-none focus:border-violet-500">
          <option>INR</option>
          <option>USD</option>
        </select>
      </div>

      <div className="flex-1 grid grid-cols-3 divide-x divide-white/5">
        
        {/* Entry Level */}
        <div className="flex flex-col pr-4">
          <div className="flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400">Entry Level</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">₹4 - 8 LPA</h4>
          <span className="text-[10px] text-slate-400 dark:text-gray-500">0 - 2 years</span>
        </div>

        {/* Mid Level */}
        <div className="flex flex-col px-4">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400">Mid Level</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">₹10 - 18 LPA</h4>
          <span className="text-[10px] text-slate-400 dark:text-gray-500">2 - 5 years</span>
        </div>

        {/* Senior Level */}
        <div className="flex flex-col pl-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400">Senior Level</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">₹25 - 40 LPA</h4>
          <span className="text-[10px] text-slate-400 dark:text-gray-500">5+ years</span>
        </div>

      </div>

      <Link to="#" className="mt-8 flex items-center gap-2 text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors w-max">
        View Detailed Salary Report <ArrowRight className="h-3 w-3" />
      </Link>
      
    </div>
  );
}
