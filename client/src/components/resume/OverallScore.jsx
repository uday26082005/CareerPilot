export default function OverallScore({ score: scoreProp, summary }) {
  const score = Math.round(scoreProp ?? 0);
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreLabel = score >= 80 ? "Excellent!" : score >= 60 ? "Good progress" : "Needs attention";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Overall Resume Score</h3>
      
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
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ee4cb" />
                <stop offset="100%" stopColor="#ffd159" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{score}</span>
            <span className="text-[10px] font-bold text-slate-400">/100</span>
          </div>
        </div>

        {/* Text Details */}
        <div>
          <h2 className={`text-xl font-bold mb-1.5 ${score >= 80 ? "text-[#4ee4cb]" : score >= 60 ? "text-[#ffd159]" : "text-[#ff94aa]"}`}>
            {scoreLabel}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {summary || "Upload a resume to get your overall score and detailed feedback."}
          </p>
        </div>
      </div>
    </div>
  );
}
