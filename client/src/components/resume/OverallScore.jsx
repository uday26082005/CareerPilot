export default function OverallScore() {
  const score = 87;
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-gray-400">Overall Resume Score</h3>
      
      <div className="flex items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative flex h-28 w-28 items-center justify-center shrink-0">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#ffffff10"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="url(#purpleGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{score}</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400">/100</span>
          </div>
        </div>

        {/* Text Details */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Excellent! 🎉</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
            Your resume is strong and well-structured. Address a few improvements to make it even better.
          </p>
        </div>
      </div>
    </div>
  );
}
