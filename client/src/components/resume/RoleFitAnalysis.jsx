import { Target, CheckCircle2, AlertCircle } from "lucide-react";

export default function RoleFitAnalysis({ targetRole, roleFit }) {
  const score = Math.round(roleFit?.score ?? 0);
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const displayStrengths = roleFit?.strengths || [];
  const displayWeaknesses = roleFit?.weaknesses || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
        
        {/* Left Side: Text Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="mb-6 text-sm font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-400" /> Role Fit Analysis
            </h3>
            
            <p className="text-xs font-medium text-slate-400 dark:text-gray-500">Target Role</p>
            <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{targetRole || "Role Not Set"}</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed max-w-sm">
              {roleFit?.summary || "Upload a resume to analyze how well it fits your target role."}
            </p>
          </div>
        </div>

        {/* Middle: Gauge */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center self-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#ffffff10" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{score}%</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400">{score >= 80 ? "Good Fit" : score >= 60 ? "Moderate Fit" : "Low Fit"}</span>
          </div>
        </div>

        {/* Right Side: Checklist */}
        <div className="flex-1 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/5 pt-4 lg:pt-0 lg:pl-6">
          {displayStrengths.length === 0 && displayWeaknesses.length === 0 && (
            <span className="text-sm text-slate-500 dark:text-gray-400">No fit details available yet.</span>
          )}
          {displayStrengths.slice(0, 3).map((skill, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-sm text-slate-600 dark:text-gray-300">{skill}</span>
            </div>
          ))}
          {displayWeaknesses.slice(0, 2).map((skill, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              <span className="text-sm text-slate-600 dark:text-gray-300">{skill}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
