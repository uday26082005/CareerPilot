import { Code, Briefcase, Building } from "lucide-react";

const TYPES = [
  {
    title: "Technical Interview",
    desc: "DSA, Algorithms, System Design and more",
    icon: Code,
    iconColor: "text-teal-600 dark:text-[#4ee4cb]",
    iconBg: "bg-teal-50 border border-teal-200 dark:border-transparent dark:bg-[#4ee4cb]/10",
    badge: "Most Popular",
    badgeColor: "text-teal-700 border-teal-200 bg-teal-50 dark:text-[#4ee4cb] dark:border-[#4ee4cb]/30 dark:bg-[#4ee4cb]/5",
    active: true
  },
  {
    title: "Behavioral Interview",
    desc: "HR questions, situational and behavioral",
    icon: Briefcase,
    iconColor: "text-amber-600 dark:text-[#ffd159]",
    iconBg: "bg-amber-50 border border-amber-200 dark:border-transparent dark:bg-[#ffd159]/10",
    badge: "Improve Soft Skills",
    badgeColor: "text-amber-800 border-amber-200 bg-amber-50 dark:text-[#ffd159] dark:border-[#ffd159]/30 dark:bg-[#ffd159]/5",
    active: false
  },
  {
    title: "Company-specific",
    desc: "Practice questions asked by top companies",
    icon: Building,
    iconColor: "text-orange-600 dark:text-[#ffb48a]",
    iconBg: "bg-orange-50 border border-orange-200 dark:border-transparent dark:bg-[#ffb48a]/10",
    badge: "Company Focused",
    badgeColor: "text-orange-700 border-orange-200 bg-orange-50 dark:text-[#ffb48a] dark:border-[#ffb48a]/30 dark:bg-[#ffb48a]/5",
    active: false
  }
];

export default function InterviewTypes({ activeType, setActiveType }) {

  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Choose Interview Type</h3>
      
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
        {TYPES.map((type, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveType(type.title)}
            className={`flex cursor-pointer flex-col justify-between rounded-2xl p-6 transition-all ${
              activeType === type.title 
                ? "border-2 border-amber-500 dark:border-[#ffd159] bg-[#FFF7E6] dark:bg-[#22252c] shadow-sm dark:shadow-xl dark:shadow-amber-500/10 scale-[1.02]" 
                : "border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] shadow-xs dark:shadow-lg dark:shadow-black/20 hover:bg-slate-50 dark:hover:bg-[#20222a] hover:border-slate-300 dark:hover:border-white/20"
            }`}
          >
            <div>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${type.iconBg} ${type.iconColor}`}>
                <type.icon className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{type.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{type.desc}</p>
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
