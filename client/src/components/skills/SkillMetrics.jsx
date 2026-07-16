import { Briefcase, BarChart2, CheckCircle2, Activity, XCircle, Info } from "lucide-react";

export default function SkillMetrics() {
  const overallScore = 68;
  const circumference = 2 * Math.PI * 40; // radius 40
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      
      {/* Card 1: Overall Match (takes 2 cols for width) */}
      <div className="flex items-center gap-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md lg:col-span-2">
        <div className="flex-1">
          <h3 className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
            Overall Skill Match <Info className="h-3 w-3" />
          </h3>
          <div className="relative flex h-24 w-24 items-center justify-center shrink-0">
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
              <span className="text-xl font-black text-slate-900 dark:text-white">{overallScore}%</span>
              <span className="text-[9px] font-bold text-emerald-400">Good Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Target Role */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md lg:col-span-1">
        <h3 className="mb-3 text-[11px] font-semibold text-slate-500 dark:text-gray-400">Target Role</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">Full Stack Developer</span>
        </div>
        <div className="text-[10px] text-slate-400 dark:text-gray-500">
          <span className="block mb-1">Experience Level</span>
          <span className="font-semibold text-slate-600 dark:text-gray-300">Fresher / Entry Level</span>
        </div>
      </div>

      {/* Card 3: Skills Analyzed */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md lg:col-span-1">
        <h3 className="text-[11px] font-semibold text-slate-500 dark:text-gray-400">Skills Analyzed</h3>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-900 dark:text-white">32</span>
            <span className="text-[10px] text-slate-400 dark:text-gray-500">Total Skills</span>
          </div>
        </div>
      </div>

      {/* Card 4: Matched Skills */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md lg:col-span-1">
        <h3 className="text-[11px] font-semibold text-slate-500 dark:text-gray-400">Matched Skills</h3>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-slate-900 dark:text-white">15</span>
            <span className="text-[10px] text-slate-400 dark:text-gray-500">47%</span>
          </div>
        </div>
      </div>

      {/* Card 5: Missing/Partial (Combined into 1 grid col for density, matching UI) */}
      <div className="flex flex-col gap-3 lg:col-span-1">
        {/* Partial Match */}
        <div className="flex flex-1 items-center justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 backdrop-blur-md">
          <div>
            <h3 className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 mb-1">Partial Match</h3>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">9</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-gray-500 self-end mb-1">28%</span>
        </div>
        
        {/* Missing Skills */}
        <div className="flex flex-1 items-center justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 backdrop-blur-md">
          <div>
            <h3 className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 mb-1">Missing Skills</h3>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <XCircle className="h-3.5 w-3.5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">8</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-gray-500 self-end mb-1">25%</span>
        </div>
      </div>

    </div>
  );
}
