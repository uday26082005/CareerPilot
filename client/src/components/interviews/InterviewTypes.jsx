import { Code, Briefcase, Target, Building } from "lucide-react";

const TYPES = [
  {
    title: "Technical Interview",
    desc: "DSA, Algorithms, System Design and more",
    icon: Code,
    iconColor: "text-[#4ee4cb]",
    iconBg: "bg-[#4ee4cb]/10",
    badge: "Most Popular",
    badgeColor: "text-[#4ee4cb] border-[#4ee4cb]/30 bg-[#4ee4cb]/5",
    active: true
  },
  {
    title: "Behavioral Interview",
    desc: "HR questions, situational and behavioral",
    icon: Briefcase,
    iconColor: "text-[#ffd159]",
    iconBg: "bg-[#ffd159]/10",
    badge: "Improve Soft Skills",
    badgeColor: "text-[#ffd159] border-[#ffd159]/30 bg-[#ffd159]/5",
    active: false
  },
  {
    title: "Role-specific Interview",
    desc: "Questions tailored for your target role",
    icon: Target,
    iconColor: "text-[#e29aff]",
    iconBg: "bg-[#e29aff]/10",
    badge: "Personalized",
    badgeColor: "text-[#e29aff] border-[#e29aff]/30 bg-[#e29aff]/5",
    active: false
  },
  {
    title: "Company-specific",
    desc: "Practice questions asked by top companies",
    icon: Building,
    iconColor: "text-[#ffb48a]",
    iconBg: "bg-[#ffb48a]/10",
    badge: "Company Focused",
    badgeColor: "text-[#ffb48a] border-[#ffb48a]/30 bg-[#ffb48a]/5",
    active: false
  }
];

export default function InterviewTypes({ activeType, setActiveType }) {

  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Choose Interview Type</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TYPES.map((type, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveType(type.title)}
            className={`flex cursor-pointer flex-col justify-between rounded-2xl p-5 transition-all ${
              activeType === type.title 
                ? "border-2 border-[#ffd159] bg-[#22252c] shadow-xl shadow-amber-500/10 scale-[1.02]" 
                : "border border-white/[0.08] bg-[#1c1e24] shadow-lg shadow-black/20 hover:bg-[#20222a] hover:border-white/20"
            }`}
          >
            <div>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${type.iconBg} ${type.iconColor}`}>
                <type.icon className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">{type.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{type.desc}</p>
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
