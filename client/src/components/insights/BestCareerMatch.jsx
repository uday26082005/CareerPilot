import { Info, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BestCareerMatch() {
  const matchScore = 95;
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  const OTHER_MATCHES = [
    { name: "Frontend Developer", percent: 92, color: "bg-emerald-500" },
    { name: "Backend Developer", percent: 88, color: "bg-blue-500" },
    { name: "Software Engineer", percent: 90, color: "bg-orange-500" },
    { name: "DevOps Engineer", percent: 75, color: "bg-purple-500" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="grid gap-8 sm:grid-cols-2 flex-1 relative z-10">
        
        {/* Left Side: Best Match */}
        <div className="flex flex-col border-r border-slate-200 dark:border-white/5 pr-6">
          <h3 className="mb-6 text-[11px] font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
            Your Best Career Match <Info className="h-3 w-3" />
          </h3>
          
          <div className="flex items-center gap-6">
            
            {/* Circular Gauge */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
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
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{matchScore}%</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 mt-1">Match</span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-xl font-bold text-violet-300 mb-2">Full Stack Developer</h2>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-gray-400 mb-4">
                Strong match based on your skills, experience, and career goals.
              </p>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {["Web Development", "Problem Solving", "React", "Node.js"].map((skill, i) => (
                  <span key={i} className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-[9px] font-medium text-indigo-300">
                    {skill}
                  </span>
                ))}
                <span className="rounded-md px-2 py-1 text-[9px] font-medium text-slate-500 dark:text-gray-400">
                  +3 more
                </span>
              </div>
            </div>
          </div>

          <Link to="#" className="mt-auto pt-6 flex items-center gap-2 text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors w-max">
            View Full Analysis <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Right Side: Other Matches */}
        <div className="flex flex-col">
          <h3 className="mb-6 text-[11px] font-semibold text-slate-500 dark:text-gray-400">Other Top Matches</h3>
          <div className="flex-1 flex flex-col justify-between">
            {OTHER_MATCHES.map((match, idx) => (
              <div key={idx} className="flex flex-col mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-gray-300">{match.name}</span>
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white">{match.percent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                  <div 
                    className={`h-full rounded-full ${match.color}`} 
                    style={{ width: `${match.percent}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
