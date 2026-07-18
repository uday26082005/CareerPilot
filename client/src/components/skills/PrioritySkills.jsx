import { Info, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SKILLS = [
  { name: "React", progress: 80, val: "20%", icon: "⚛️", badge: "High", badgeColor: "text-red-400 border-red-500/30" },
  { name: "Node.js", progress: 75, val: "25%", icon: "⬢", badge: "High", badgeColor: "text-red-400 border-red-500/30" },
  { name: "TypeScript", progress: 90, val: "10%", icon: "TS", badge: "High", badgeColor: "text-red-400 border-red-500/30" },
  { name: "Docker", progress: 85, val: "15%", icon: "🐳", badge: "Medium", badgeColor: "text-orange-400 border-orange-500/30" },
  { name: "AWS", progress: 80, val: "20%", icon: "☁️", badge: "Medium", badgeColor: "text-orange-400 border-orange-500/30" },
];

export default function PrioritySkills() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-6 text-base font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-2">
        Priority Skills to Learn <Info className="h-4 w-4" />
      </h3>
      
      <div className="flex-1 space-y-5">
        {SKILLS.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-4">
            
            {/* Icon Mockup */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] text-base font-black text-slate-600 dark:text-gray-300">
              {skill.icon}
            </div>
            
            {/* Name & Bar */}
            <div className="flex-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">{skill.name}</span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                <div 
                  className="h-full rounded-full bg-violet-600" 
                  style={{ width: `${skill.progress}%` }} 
                />
              </div>
            </div>

            {/* Gap & Priority */}
            <div className="flex items-center gap-3 shrink-0 w-24 justify-end">
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">{skill.val}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${skill.badgeColor}`}>
                {skill.badge}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
