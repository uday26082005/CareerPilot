import { Code, Briefcase, Target, Building, Star } from "lucide-react";

const TYPES = [
  {
    title: "Technical Interview",
    desc: "DSA, Algorithms, System Design and more",
    icon: Code,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    badge: "Most Popular",
    badgeColor: "text-violet-400 border-violet-500/30",
    active: true
  },
  {
    title: "Behavioral Interview",
    desc: "HR questions, situational and behavioral",
    icon: Briefcase,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    badge: "Improve Soft Skills",
    badgeColor: "text-blue-400 border-blue-500/30",
    active: false
  },
  {
    title: "Role-specific Interview",
    desc: "Questions tailored for your target role",
    icon: Target,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    badge: "Personalized",
    badgeColor: "text-emerald-400 border-emerald-500/30",
    active: false
  },
  {
    title: "Company-specific",
    desc: "Practice questions asked by top companies",
    icon: Building,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10",
    badge: "Company Focused",
    badgeColor: "text-orange-400 border-orange-500/30",
    active: false
  },
  {
    title: "Custom Interview",
    desc: "Create your own interview with specific topics",
    icon: Star,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    badge: "Fully Customized",
    badgeColor: "text-violet-400 border-violet-500/30",
    active: false
  }
];

export default function InterviewTypes() {
  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-gray-400">Choose Interview Type</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TYPES.map((type, idx) => (
          <div 
            key={idx} 
            className={`flex cursor-pointer flex-col justify-between rounded-xl p-5 transition-all ${
              type.active 
                ? "border border-violet-500 bg-violet-900/10 shadow-[0_0_20px_rgba(139,92,246,0.15)] scale-[1.02]" 
                : "border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:bg-white/[0.04] hover:border-slate-200 dark:border-white/10"
            }`}
          >
            <div>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${type.iconBg} ${type.iconColor}`}>
                <type.icon className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{type.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed mb-6">{type.desc}</p>
            </div>
            
            <div className={`w-fit rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${type.badgeColor}`}>
              {type.badge}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
