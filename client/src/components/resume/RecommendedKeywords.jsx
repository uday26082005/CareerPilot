import { Info } from "lucide-react";

const DEFAULT_KEYWORDS = [
    "JavaScript", "React.js", "Node.js", "SQL",
    "Problem Solving", "Data Structures", "Git",
    "REST APIs", "Agile", "MongoDB", "AWS"
];

export default function RecommendedKeywords({ keywords }) {
  const displayedKeywords = keywords ?? DEFAULT_KEYWORDS;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
        Recommended Keywords <Info className="h-4 w-4 text-teal-600 dark:text-[#4ee4cb]" />
      </h3>
      
      <div className="flex-1 flex flex-wrap gap-2 content-start">
        {displayedKeywords.map((kw, idx) => (
          <span 
            key={idx} 
            className="rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm dark:border-white/[0.08] dark:bg-[#242730] dark:text-slate-200 dark:hover:bg-[#2e323e] dark:hover:border-white/20 dark:hover:text-white"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
