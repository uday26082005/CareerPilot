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
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          AI Recommendations
        </h3>
      </div>

      <div className="flex-1 space-y-2">
        {recommendations.map((rec, idx) => (
          <Link to={`/ask-ai?q=${encodeURIComponent(rec.question || rec.title)}`} key={idx} className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 transition-colors hover:border-slate-200 dark:border-white/10 hover:bg-white/[0.04]">
            <div className="flex items-center gap-4 flex-1">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getBg(rec.type)}`}>
                {getIcon(rec.type)}
              </div>
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-semibold leading-snug text-slate-900 dark:text-white group-hover:text-violet-300 transition-colors break-words whitespace-normal">{rec.title}</h4>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-violet-400 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
