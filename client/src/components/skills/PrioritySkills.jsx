import { Info, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrioritySkills({ prioritySkills = [] }) {
  // Mocking the progress bars since Gemini only returns skill names
  const SKILLS = prioritySkills.map((skill, index) => ({
    name: skill,
    progress: Math.max(30, 90 - (index * 15)), // arbitrary descending progress
    val: "High",
    icon: "🔥",
    badge: index < 2 ? "High" : "Medium",
    badgeColor: index < 2 ? "text-red-400 border-red-500/30" : "text-orange-400 border-orange-500/30"
  })).slice(0, 5); // take top 5

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
