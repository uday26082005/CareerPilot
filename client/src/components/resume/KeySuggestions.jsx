import { BarChart, Target, Search, Code, ChevronRight, ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const SUGGESTIONS = [
  {
    title: "Add more quantifiable achievements",
    desc: "Include numbers and metrics to highlight your impact.",
    icon: BarChart,
    color: "bg-violet-500/10 border-violet-500/20 text-violet-400"
  },
  {
    title: "Improve your summary",
    desc: "Make your summary more targeted to the role.",
    icon: Target,
    color: "bg-blue-500/10 border-blue-500/20 text-blue-400"
  },
  {
    title: "Include relevant keywords",
    desc: "Add industry-specific keywords to improve ATS score.",
    icon: Search,
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
  },
  {
    title: "Enhance project descriptions",
    desc: "Provide more details about technologies and impact.",
    icon: Code,
    color: "bg-orange-500/10 border-orange-500/20 text-orange-400"
  }
];

export default function KeySuggestions({ suggestions }) {
  const displayedSuggestions = suggestions === undefined
    ? SUGGESTIONS
    : suggestions.map((suggestion, index) => ({
      ...SUGGESTIONS[index % SUGGESTIONS.length],
      title: suggestion,
      desc: "Address this area to strengthen your resume.",
    }));

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-base font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-violet-400" /> Key Suggestions
      </h3>
      
      <div className="flex-1 space-y-3">
        {displayedSuggestions.map((item, idx) => (
          <div key={idx} className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-3 transition-colors hover:border-slate-200 dark:border-white/10 hover:bg-white/[0.04]">
            {/* Icon */}
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            
            {/* Text */}
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-300 transition-colors">{item.title}</h4>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
