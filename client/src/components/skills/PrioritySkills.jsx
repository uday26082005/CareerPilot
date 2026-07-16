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
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-6 text-sm font-semibold text-gray-400 flex items-center gap-2">
        Priority Skills to Learn <Info className="h-3 w-3" />
      </h3>
      
      <div className="flex-1 space-y-5">
        {SKILLS.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-4">
            
            {/* Icon Mockup */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-sm font-black text-gray-300">
              {skill.icon}
            </div>
            
            {/* Name & Bar */}
            <div className="flex-1">
              <span className="text-xs font-bold text-white mb-1.5 block">{skill.name}</span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div 
                  className="h-full rounded-full bg-violet-600" 
                  style={{ width: `${skill.progress}%` }} 
                />
              </div>
            </div>

            {/* Gap & Priority */}
            <div className="flex items-center gap-3 shrink-0 w-24 justify-end">
              <span className="text-[10px] font-bold text-gray-400">{skill.val}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${skill.badgeColor}`}>
                {skill.badge}
              </span>
            </div>

          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <Link to="/learning-plan" className="flex items-center gap-2 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300">
          View Learning Plan <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
