import { Lightbulb, Mic, FileText, BarChart } from "lucide-react";

const TIPS = [
  {
    title: "Practice Regularly",
    desc: "Consistent practice helps improve your confidence and performance.",
    icon: Lightbulb,
    color: "bg-[#ffd159]/10 text-[#ffd159] border-[#ffd159]/30"
  },
  {
    title: "Speak Clearly",
    desc: "Speak at a moderate pace and be clear in your responses.",
    icon: Mic,
    color: "bg-[#4ee4cb]/10 text-[#4ee4cb] border-[#4ee4cb]/30"
  },
  {
    title: "Structure Answers",
    desc: "Use frameworks like STAR or Pyramid Principle.",
    icon: FileText,
    color: "bg-[#e29aff]/10 text-[#e29aff] border-[#e29aff]/30"
  },
  {
    title: "Review & Improve",
    desc: "Analyze your feedback and work on your weak areas.",
    icon: BarChart,
    color: "bg-[#ffb48a]/10 text-[#ffb48a] border-[#ffb48a]/30"
  }
];

export default function InterviewTips() {
  return (
    <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Interview Tips</h3>
      </div>
      
      <div className="flex-1 flex flex-col gap-2.5">
        {TIPS.map((tip, idx) => (
          <div key={idx} className="flex items-start gap-3.5 rounded-2xl border border-white/[0.06] bg-[#242730] p-3.5 transition-colors hover:border-white/10">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tip.color}`}>
              <tip.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">{tip.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
