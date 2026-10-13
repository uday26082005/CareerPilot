import { FileText, Target, Mic, Lightbulb, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AIRecommendations({ recommendations }) {
  const getIcon = (type) => {
    switch (type) {
      case "resume": return <FileText className="h-5 w-5 text-amber-600 dark:text-[#ffd159]" />;
      case "skills": return <Target className="h-5 w-5 text-teal-600 dark:text-[#4ee4cb]" />;
      case "interview": return <Mic className="h-5 w-5 text-orange-600 dark:text-[#ffb48a]" />;
      case "jobs": return <Lightbulb className="h-5 w-5 text-blue-600 dark:text-[#72c5ff]" />;
      default: return <FileText className="h-5 w-5 text-amber-600 dark:text-[#ffd159]" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case "resume": return "bg-amber-50 border-amber-200 dark:bg-[#ffd159]/15 dark:border-[#ffd159]/30";
      case "skills": return "bg-teal-50 border-teal-200 dark:bg-[#4ee4cb]/15 dark:border-[#4ee4cb]/30";
      case "interview": return "bg-orange-50 border-orange-200 dark:bg-[#ffb48a]/15 dark:border-[#ffb48a]/30";
      case "jobs": return "bg-blue-50 border-blue-200 dark:bg-[#72c5ff]/15 dark:border-[#72c5ff]/30";
      default: return "bg-amber-50 border-amber-200 dark:bg-[#ffd159]/15 dark:border-[#ffd159]/30";
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 shadow-sm dark:shadow-xl dark:shadow-black/25">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
          AI Recommendations
        </h3>
      </div>

      <div className="flex-1 space-y-3">
        {recommendations.map((rec, idx) => (
          <Link 
            to={`/ask-ai?q=${encodeURIComponent(rec.question || rec.title)}`} 
            key={idx} 
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#242730] p-4 transition-all duration-200 hover:border-slate-300 dark:hover:border-white/15 hover:bg-slate-100 dark:hover:bg-[#2b2f3a] shadow-sm"
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getBg(rec.type)}`}>
                {getIcon(rec.type)}
              </div>
              <div className="flex-1 pr-3 min-w-0">
                <h4 className="text-sm font-semibold leading-snug text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#ffd159] transition-colors truncate">
                  {rec.title}
                </h4>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
