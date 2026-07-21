import { CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";

const DEFAULT_STRENGTHS = [
    "Good use of action verbs",
    "Strong technical skills",
    "Relevant projects included",
    "Clear and concise experience"
];

export default function TopStrengths({ strengths }) {
  const displayedStrengths = strengths ?? DEFAULT_STRENGTHS;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md relative overflow-hidden">
      <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-violet-400" /> Top Strengths
      </h3>
      
      <div className="relative z-10 flex flex-col gap-3">
        {displayedStrengths.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-sm text-slate-600 dark:text-gray-300">{item}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
