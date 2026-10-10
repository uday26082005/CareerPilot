import { Info } from "lucide-react";

const DEFAULT_KEYWORDS = [
    "JavaScript", "React.js", "Node.js", "SQL",
    "Problem Solving", "Data Structures", "Git",
    "REST APIs", "Agile", "MongoDB", "AWS"
];

export default function RecommendedKeywords({ keywords }) {
  const displayedKeywords = keywords ?? DEFAULT_KEYWORDS;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        Recommended Keywords <Info className="h-4 w-4 text-[#4ee4cb]" />
      </h3>
      
      <div className="flex-1 flex flex-wrap gap-2 content-start">
        {displayedKeywords.map((kw, idx) => (
          <span 
            key={idx} 
            className="rounded-full border border-white/[0.08] bg-[#242730] px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:bg-[#2e323e] hover:border-white/20 hover:text-white shadow-sm"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
