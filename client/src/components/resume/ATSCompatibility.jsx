import { FileText } from "lucide-react";

export default function ATSCompatibility({ score: scoreProp, status, tips }) {
  const score = Math.round(scoreProp ?? 0);
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const label = status || (score >= 80 ? "High Match" : score >= 60 ? "Moderate Match" : "Needs Work");

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-gray-400">ATS Compatibility</h3>
      
      <div className="flex items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative flex h-28 w-28 items-center justify-center shrink-0">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#ffffff10" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#10b981" // emerald-500
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{score}%</span>
          </div>
        </div>

        {/* Text Details */}
        <div>
          <h2 className="text-xl font-bold text-emerald-500 mb-2">{label}</h2>
          {tips && tips.length > 0 ? (
            <ul className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed list-disc pl-3">
              {tips.map((tip, idx) => (
                <li key={idx} className="mb-1">{tip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
              No specific ATS tips provided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
