import { Target, CheckCircle2, AlertCircle } from "lucide-react";

export default function RoleFitAnalysis({ targetRole, roleFit }) {
  const score = Math.round(roleFit?.score ?? 0);
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const displayStrengths = roleFit?.strengths || [];
  const displayWeaknesses = roleFit?.weaknesses || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
        
        {/* Left Side: Text Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600 dark:text-[#e29aff]" /> Role Fit Analysis
            </h3>
            
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">Target Role</p>
            <h2 className="mb-2 text-2xl font-black text-slate-900 dark:text-white capitalize">{targetRole || "Role Not Set"}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {roleFit?.summary || "Upload a resume to analyze how well it fits your target role."}
            </p>
          </div>
        </div>

        {/* Middle: Gauge */}
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center self-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" className="text-slate-200 dark:text-white/[0.06]" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="url(#fitGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="fitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{score}%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{score >= 80 ? "Good Fit" : score >= 60 ? "Moderate Fit" : "Low Fit"}</span>
          </div>
        </div>

        {/* Right Side: Checklist */}
        <div className="flex-1 flex flex-col justify-center gap-2.5 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/[0.06] pt-4 lg:pt-0 lg:pl-6">
          {displayStrengths.length === 0 && displayWeaknesses.length === 0 && (
            <span className="text-sm text-slate-500 dark:text-slate-400">No fit details available yet.</span>
          )}
          {displayStrengths.slice(0, 3).map((skill, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 shadow-sm dark:border-white/[0.04] dark:bg-[#242730]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-[#4ee4cb] stroke-[2.5]" />
              <span className="text-sm font-medium text-slate-800 dark:text-white">{skill}</span>
            </div>
          ))}
          {displayWeaknesses.slice(0, 2).map((skill, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 shadow-sm dark:border-white/[0.04] dark:bg-[#242730]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-[#ffb48a] stroke-[2.5]" />
              <span className="text-sm font-medium text-slate-800 dark:text-white">{skill}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
