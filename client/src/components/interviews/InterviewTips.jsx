import { Lightbulb, Mic, FileText, BarChart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TIPS = [
  {
    title: "Practice Regularly",
    desc: "Consistent practice helps improve your confidence and performance.",
    icon: Lightbulb,
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20"
  },
  {
    title: "Speak Clearly",
    desc: "Speak at a moderate pace and be clear in your responses.",
    icon: Mic,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    title: "Structure Answers",
    desc: "Use frameworks like STAR or Pyramid Principle.",
    icon: FileText,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    title: "Review & Improve",
    desc: "Analyze your feedback and work on your weak areas.",
    icon: BarChart,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  }
];

export default function InterviewTips() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400">Interview Tips</h3>
        <Link to="/tips" className="text-xs font-medium text-violet-400 hover:text-violet-300">View All</Link>
      </div>
      
      <div className="flex-1 space-y-3">
        {TIPS.map((tip, idx) => (
          <div key={idx} className="flex items-start gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${tip.color}`}>
              <tip.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{tip.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
