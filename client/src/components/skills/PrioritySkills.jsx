import { Flame, CheckCircle2, AlertCircle } from "lucide-react";

export default function PrioritySkills({ 
  marketDemandSkills = [], 
  prioritySkills = [] 
}) {
  // Use marketDemandSkills if available, or transform legacy prioritySkills
  let items = [];

  if (Array.isArray(marketDemandSkills) && marketDemandSkills.length > 0) {
    items = marketDemandSkills.slice(0, 6);
  } else if (Array.isArray(prioritySkills) && prioritySkills.length > 0) {
    items = prioritySkills.slice(0, 6).map((skill, index) => ({
      name: skill,
      marketDemand: index < 2 ? "Very High" : "High",
      roleRelevance: index < 2 ? "Core" : "Important",
      resumeDetected: false,
      isTrending: index < 2,
      status: "Not Detected"
    }));
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 shadow-xs hover:shadow-sm transition-all backdrop-blur-md">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="h-4 w-4 text-[#D97706] dark:text-amber-400" />
            Current Market-Demand Skills
          </h3>
          <span className="text-[10px] text-[#D97706] font-semibold bg-[#FFF7E6] px-2.5 py-0.5 rounded-full border border-[#FDE7B0] dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
            Market Layer
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-4 leading-relaxed">
          These are currently demanded or emerging skills that may improve market alignment. They are not all mandatory for the selected role.
        </p>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length > 0 ? (
          items.map((skill, idx) => {
            const isDetected = skill.resumeDetected || skill.isDetected;
            const marketDemand = skill.marketDemand || (skill.isTrending ? "Very High" : "High");
            const roleRelevance = skill.roleRelevance || (skill.roleTier === "core" ? "Core" : "Important");

            return (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50 hover:bg-slate-100/80 transition-colors shadow-2xs dark:bg-white/[0.015]"
              >
                {/* Left: Icon & Skill Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF7E6] text-[#D97706] border border-[#FDE7B0] dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 text-xs">
                    {skill.isTrending ? "🔥" : "⚡"}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Demand: <strong className={marketDemand === "Very High" ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"}>{marketDemand}</strong>
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Role: <strong className={roleRelevance === "Core" || roleRelevance === "High" ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}>{roleRelevance}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Detected / Not Detected Pill */}
                <div className="shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                    isDetected
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                      : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                  }`}>
                    {isDetected ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        Detected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400/80" />
                        Not Detected
                      </>
                    )}
                  </span>
                </div>

              </div>
            );
          })
        ) : (
          <span className="text-xs text-slate-500 italic">No market-demand skills loaded.</span>
        )}
      </div>
    </div>
  );
}
