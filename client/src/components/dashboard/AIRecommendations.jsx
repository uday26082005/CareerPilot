import { Sparkles, FileText, Target, Mic, Lightbulb, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AIRecommendations({ recommendations }) {
  const getIcon = (type) => {
    switch (type) {
      case "resume": return <FileText className="h-5 w-5 text-violet-400" />;
      case "skills": return <Target className="h-5 w-5 text-emerald-400" />;
      case "interview": return <Mic className="h-5 w-5 text-blue-400" />;
      case "jobs": return <Lightbulb className="h-5 w-5 text-orange-400" />;
      default: return <Sparkles className="h-5 w-5 text-violet-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case "resume": return "bg-violet-500/10 border-violet-500/20";
      case "skills": return "bg-emerald-500/10 border-emerald-500/20";
      case "interview": return "bg-blue-500/10 border-blue-500/20";
      case "jobs": return "bg-orange-500/10 border-orange-500/20";
      default: return "bg-violet-500/10 border-violet-500/20";
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" /> AI Recommendations
        </h3>
        <Link to="/recommendations" className="flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex-1 space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getBg(rec.type)}`}>
                {getIcon(rec.type)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{rec.title}</h4>
                <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{rec.desc}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
