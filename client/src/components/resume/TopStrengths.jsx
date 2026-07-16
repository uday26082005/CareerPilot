import { CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";

export default function TopStrengths() {
  const strengths = [
    "Good use of action verbs",
    "Strong technical skills",
    "Relevant projects included",
    "Clear and concise experience"
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md relative overflow-hidden">
      <h3 className="mb-4 text-sm font-semibold text-gray-400 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-violet-400" /> Top Strengths
      </h3>
      
      <div className="relative z-10 flex flex-col gap-3">
        {strengths.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-sm text-gray-300">{item}</span>
          </div>
        ))}
      </div>

      {/* Decorative Shield Graphic */}
      <div className="absolute right-[-20px] bottom-[-20px] z-0 opacity-20 pointer-events-none">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="url(#shieldGradient)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#shieldGradient)" />
          <path d="M12 8v4" stroke="white" strokeWidth="2" />
          <path d="M12 16h.01" stroke="white" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
