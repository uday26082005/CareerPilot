import { FileText, Target, Mic, Lightbulb, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AIRecommendations({ recommendations }) {
  const getIcon = (type) => {
    switch (type) {
      case "resume": return <FileText className="h-5 w-5 text-[#ffd159]" />;
      case "skills": return <Target className="h-5 w-5 text-[#4ee4cb]" />;
      case "interview": return <Mic className="h-5 w-5 text-[#ffb48a]" />;
      case "jobs": return <Lightbulb className="h-5 w-5 text-[#72c5ff]" />;
      default: return <FileText className="h-5 w-5 text-[#ffd159]" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case "resume": return "bg-[#ffd159]/15 border-[#ffd159]/30";
      case "skills": return "bg-[#4ee4cb]/15 border-[#4ee4cb]/30";
      case "interview": return "bg-[#ffb48a]/15 border-[#ffb48a]/30";
      case "jobs": return "bg-[#72c5ff]/15 border-[#72c5ff]/30";
      default: return "bg-[#ffd159]/15 border-[#ffd159]/30";
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-wide">
          AI Recommendations
        </h3>
      </div>

      <div className="flex-1 space-y-3">
        {recommendations.map((rec, idx) => (
          <Link 
            to={`/ask-ai?q=${encodeURIComponent(rec.question || rec.title)}`} 
            key={idx} 
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-[#242730] p-4 transition-all duration-200 hover:border-white/15 hover:bg-[#2b2f3a] shadow-sm"
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getBg(rec.type)}`}>
                {getIcon(rec.type)}
              </div>
              <div className="flex-1 pr-3 min-w-0">
                <h4 className="text-sm font-semibold leading-snug text-white group-hover:text-[#ffd159] transition-colors truncate">
                  {rec.title}
                </h4>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
