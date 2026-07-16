import { FileText } from "lucide-react";

export default function ATSCompatibility() {
  const score = 92;
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex h-full flex-col items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center backdrop-blur-md">
      <h3 className="mb-2 w-full text-left text-sm font-semibold text-gray-400">ATS Compatibility</h3>
      
      {/* Circular Gauge */}
      <div className="relative mt-2 flex h-32 w-32 items-center justify-center shrink-0">
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
          <span className="text-3xl font-black text-white">{score}%</span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">High Match</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400 leading-relaxed px-4">
        Great! Your resume is highly optimized for ATS systems.
      </p>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
        <FileText className="h-4 w-4" /> View ATS Report
      </button>
    </div>
  );
}
