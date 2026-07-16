import { Info, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecommendedKeywords() {
  const keywords = [
    "JavaScript", "React.js", "Node.js", "SQL",
    "Problem Solving", "Data Structures", "Git",
    "REST APIs", "Agile", "MongoDB", "AWS"
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-sm font-semibold text-gray-400 flex items-center gap-2">
        Recommended Keywords <Info className="h-4 w-4" />
      </h3>
      
      <div className="flex-1 flex flex-wrap gap-2 content-start">
        {keywords.map((kw, idx) => (
          <span 
            key={idx} 
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            {kw}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <Link to="/keywords" className="flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300">
          View All Keywords <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
