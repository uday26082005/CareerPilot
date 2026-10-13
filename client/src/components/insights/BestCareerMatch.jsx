export default function BestCareerMatch({ data }) {
  if (!data) return null;
  const matchScore = data.match_score || 0;
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25 relative overflow-hidden">
      <div className="flex-1 relative z-10 w-full flex flex-col justify-center">
        
        {/* Best Match */}
        <div className="flex flex-col w-full">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            Your Best Career Match
          </h3>
          
          <div className="flex items-center gap-6">
            
            {/* Circular Gauge */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" className="text-slate-200 dark:text-[#242730]" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-teal-600 dark:text-[#4ee4cb] transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(13,148,136,0.2)] dark:drop-shadow-[0_0_8px_rgba(78,228,203,0.3)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{matchScore}%</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Match</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-amber-600 dark:text-[#ffd159] mb-1.5">{data.best_match_role}</h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {data.match_reason}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
