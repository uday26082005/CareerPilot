import { Briefcase, BarChart2, CheckCircle2, XCircle, Info } from "lucide-react";

export default function SkillMetrics({ 
  overallScore = 0, 
  targetRole = "Not Set", 
  totalSkills = 0, 
  matchedSkills = 0, 
  missingSkills = 0 
}) {
  const circumference = 2 * Math.PI * 40; // radius 40
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* Card 1: Overall Match */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md lg:col-span-1">
        <h3 className="w-full mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-gray-400 justify-start">
          Overall Skill Match <Info className="h-4 w-4" />
        </h3>
        <div className="flex items-center justify-center gap-8 w-full mt-2">
          <div className="relative flex h-28 w-28 items-center justify-center shrink-0">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffffff10" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="url(#matchGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{overallScore}%</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-emerald-400 leading-tight">Good<br />Match</span>
          </div>
        </div>
      </div>

      {/* Card 2: Target Role */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md lg:col-span-1">
        <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-gray-400">Target Role</h3>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white">{targetRole}</span>
        </div>
        <div className="text-xs text-slate-400 dark:text-gray-500">
          <span className="block mb-1">Target Role</span>
          <span className="font-semibold text-slate-600 dark:text-gray-300 text-sm">{targetRole}</span>
        </div>
      </div>

      {/* Card 3: Combined Skills Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md lg:col-span-2">
        
        {/* Total Skills */}
        <div className="flex flex-col flex-1 w-full">
          <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-gray-400">Total Skills</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <BarChart2 className="h-6 w-6" />
            </div>
            <span className="block text-3xl font-bold text-slate-900 dark:text-white leading-tight">{totalSkills}</span>
          </div>
        </div>

        <div className="h-px w-full sm:h-16 sm:w-px bg-slate-200 dark:bg-white/10 shrink-0" />

        {/* Matched Skills */}
        <div className="flex flex-col flex-1 w-full">
          <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-gray-400">Matched Skills</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="block text-3xl font-bold text-slate-900 dark:text-white leading-tight">{matchedSkills}</span>
          </div>
        </div>

        <div className="h-px w-full sm:h-16 sm:w-px bg-slate-200 dark:bg-white/10 shrink-0" />

        {/* Missing Skills */}
        <div className="flex flex-col flex-1 w-full">
          <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-gray-400">Missing Skills</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <XCircle className="h-6 w-6" />
            </div>
            <span className="block text-3xl font-bold text-slate-900 dark:text-white leading-tight">{missingSkills}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
