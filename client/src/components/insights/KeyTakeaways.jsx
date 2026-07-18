import { Target, ShieldCheck, Briefcase, ArrowUpRight } from "lucide-react";

export default function KeyTakeaways() {
  const TAKEAWAYS = [
    {
      title: "You are highly aligned with Full Stack Developer roles.",
      desc: "Focus on backend and cloud technologies to unlock more opportunities.",
      icon: Target,
      iconColor: "text-violet-400 bg-violet-500/10"
    },
    {
      title: "The job market for Full Stack Developers is very strong right now.",
      desc: "Keep building skills in high-demand areas.",
      icon: ShieldCheck,
      iconColor: "text-blue-400 bg-blue-500/10"
    },
    {
      title: "Top companies are actively hiring.",
      desc: "Keep applying and track your progress regularly.",
      icon: Briefcase,
      iconColor: "text-emerald-400 bg-emerald-500/10"
    },
    {
      title: "Stay consistent with learning and practice.",
      desc: "Small daily improvements lead to big career growth.",
      icon: ArrowUpRight,
      iconColor: "text-orange-400 bg-orange-500/10"
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      
      <h3 className="mb-6 text-base font-semibold text-slate-500 dark:text-gray-400">Key Takeaways</h3>

      <div className="flex-1 flex flex-col justify-between">
        {TAKEAWAYS.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconColor}`}>
              <item.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
