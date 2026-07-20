import { Briefcase, CheckCircle2, CircleDashed, Circle, Target } from "lucide-react";

export default function RoadmapOverview() {
  const percentComplete = 25;
  const circumference = 2 * Math.PI * 40; // radius 40
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  return (
    <div className="flex rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md overflow-hidden relative">
      
      {/* 2 Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full divide-y md:divide-y-0 md:divide-x divide-white/10 gap-6 md:gap-0">
        
        {/* Col 1: Role & Overall Progress */}
        <div className="flex items-center justify-between md:pr-12 h-full w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Target Role</p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Full Stack Developer</h2>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center ml-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center mb-1">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffffff10" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{percentComplete}%</span>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Completion</span>
          </div>
        </div>

        <div className="flex flex-col justify-center pl-0 md:pl-12 py-4 md:py-0 space-y-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-gray-300">Completed</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">12 / 45</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDashed className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-gray-300">In Progress</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">5 / 45</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-slate-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-gray-300">Pending</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">28 / 45</span>
          </div>
        </div>

      </div>
    </div>
  );
}
