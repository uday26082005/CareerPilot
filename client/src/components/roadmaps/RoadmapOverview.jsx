import { Briefcase, CheckCircle2, CircleDashed, Circle } from "lucide-react";

export default function RoadmapOverview({ roadmap }) {
  if (!roadmap) return null;

  let completedTasks = 0;
  let inProgressTasks = 0;
  let pendingTasks = 0;
  let totalTasks = 0;

  roadmap.phases?.forEach(phase => {
    phase.tasks?.forEach(task => {
      totalTasks++;
      if (task.status === "Completed") completedTasks++;
      else if (task.status === "In Progress") inProgressTasks++;
      else pendingTasks++;
    });
  });

  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const circumference = 2 * Math.PI * 40; // radius 40
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;



  return (
    <div className="flex rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25 overflow-hidden relative">
      
      {/* 2 Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full divide-y md:divide-y-0 md:divide-x divide-white/[0.08] gap-6 md:gap-0">
        
        {/* Col 1: Role & Overall Progress */}
        <div className="flex items-center justify-between md:pr-12 h-full w-full">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffd159]/10 text-[#ffd159]">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Target Role</p>
              <h2 className="text-xl font-bold text-white">{roadmap.target_role || "Professional Developer"}</h2>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center ml-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center mb-1">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#242730" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#4ee4cb"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white">{percentComplete}%</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Completion</span>
          </div>
        </div>

        <div className="flex flex-col justify-center pl-0 md:pl-12 py-4 md:py-0 space-y-3.5 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#4ee4cb]" />
              <span className="text-sm font-medium text-slate-300">Completed</span>
            </div>
            <span className="text-sm font-bold text-white">{completedTasks} / {totalTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDashed className="h-5 w-5 text-[#ffd159]" />
              <span className="text-sm font-medium text-slate-300">In Progress</span>
            </div>
            <span className="text-sm font-bold text-white">{inProgressTasks} / {totalTasks}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-400">Pending</span>
            </div>
            <span className="text-sm font-bold text-slate-400">{pendingTasks} / {totalTasks}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
