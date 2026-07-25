import { Info, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BestCareerMatch({ data }) {
  if (!data) return null;
  const matchScore = data.match_score || 0;
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="flex-1 relative z-10 w-full">
        
        {/* Best Match */}
        <div className="flex flex-col w-full">
          <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
            Your Best Career Match
          </h3>
          
          <div className="flex items-center gap-6">
            
            {/* Circular Gauge */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#ffffff10" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{matchScore}%</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 mt-1">Match</span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-2xl font-bold text-violet-300 mb-1">{data.best_match_role}</h2>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-400">
                {data.match_reason}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
