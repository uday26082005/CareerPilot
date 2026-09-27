import { Briefcase, Layers, Flame } from "lucide-react";

export default function SkillMetrics({ 
  roleCoverage = null,
  roleSkillsDetected = [],
  roleSkillsGaps = [],
  marketDetected = null,
  totalMarketSkills = 25,
  targetRole = "Not Set", 
  totalRoleSkills = 0,
  roleDetected = null,
  roleGaps = null
}) {
  // Exact Role Universe Numbers: roleDetected + roleGaps === totalRoleSkills
  const detectedRoleCount = roleDetected !== null 
    ? roleDetected 
    : (Array.isArray(roleSkillsDetected) ? roleSkillsDetected.length : 0);

  const dynamicRoleTotal = (Array.isArray(roleSkillsDetected) && Array.isArray(roleSkillsGaps) && (roleSkillsDetected.length + roleSkillsGaps.length > 0))
    ? (roleSkillsDetected.length + roleSkillsGaps.length)
    : (totalRoleSkills || detectedRoleCount + (roleGaps || 0));

  const displayRoleDetected = detectedRoleCount;
  const displayRoleTotal = dynamicRoleTotal;

  // Exact Market Universe Numbers: marketDetected + marketGaps === totalMarketSkills (25)
  const displayMarketTotal = totalMarketSkills || 25;
  const displayMarketDetected = marketDetected !== null 
    ? marketDetected 
    : (Array.isArray(roleSkillsDetected) ? roleSkillsDetected.filter(s => s.isMarketSkill).length : 0);

  // 1. Core Weightage Method:
  // - Core weight: 3.0, Important weight: 2.0, Supporting weight: 0.5 (max 3.0 points)
  const coreWeight = 3.0;
  const importantWeight = 2.0;
  const supportingWeight = 0.5;

  let coreDetectedCount = 0;
  let importantDetectedCount = 0;
  let supportingDetectedCount = 0;

  if (Array.isArray(roleSkillsDetected) && roleSkillsDetected.length > 0) {
    coreDetectedCount = roleSkillsDetected.filter(s => s.roleTier === "core").length;
    importantDetectedCount = roleSkillsDetected.filter(s => s.roleTier === "important").length;
    supportingDetectedCount = roleSkillsDetected.filter(s => s.roleTier === "supporting" || (!s.roleTier && s.roleRelevance !== "High")).length;
  }

  // Dynamic total tier counts directly from gaps + detected:
  let coreGapsCount = 0;
  let importantGapsCount = 0;
  if (Array.isArray(roleSkillsGaps) && roleSkillsGaps.length > 0) {
    coreGapsCount = roleSkillsGaps.filter(s => s.roleTier === "core").length;
    importantGapsCount = roleSkillsGaps.filter(s => s.roleTier === "important").length;
  }

  const effectiveTotalCore = coreDetectedCount + coreGapsCount;
  const effectiveTotalImportant = importantDetectedCount + importantGapsCount;

  const supportingContribution = Math.min(3.0, supportingWeight * supportingDetectedCount);
  const weightedNumerator = (coreWeight * coreDetectedCount) + (importantWeight * importantDetectedCount) + supportingContribution;
  const weightedDenominator = (coreWeight * effectiveTotalCore) + (importantWeight * effectiveTotalImportant);

  let coverageScore;
  if (roleCoverage !== null && roleCoverage !== undefined) {
    coverageScore = roleCoverage;
  } else if (weightedDenominator > 0) {
    coverageScore = Math.min(100, Math.round((weightedNumerator / weightedDenominator) * 100));
  } else {
    coverageScore = displayRoleTotal > 0 ? Math.round((displayRoleDetected / displayRoleTotal) * 100) : 0;
  }

  const circumference = 2 * Math.PI * 38;
  const coverageOffset = circumference - (coverageScore / 100) * circumference;

  // 2. Market Demand Match (Direct unweighted calculation, NO trending weightage):
  // e.g. 4 / 25 detected = 16%, or 11 / 25 detected = 44%
  const marketScore = displayMarketTotal > 0 
    ? Math.round((displayMarketDetected / displayMarketTotal) * 100) 
    : 0;
  const marketOffset = circumference - (marketScore / 100) * circumference;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* Card 1: Role Skill Coverage */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          <Layers className="h-4 w-4 text-violet-400" />
          Role Skill Coverage
        </h3>

        <div className="flex items-center gap-3.5 mt-3">
          <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ffffff10" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="url(#coverageGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={coverageOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="coverageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{coverageScore}%</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className={`text-xs font-bold leading-tight ${
              coverageScore >= 75 ? "text-emerald-400" :
              coverageScore >= 50 ? "text-blue-400" :
              coverageScore >= 30 ? "text-amber-400" :
              "text-rose-400"
            }`}>
              {coverageScore >= 75 ? "Strong\nCoverage" :
               coverageScore >= 50 ? "Solid\nCoverage" :
               coverageScore >= 30 ? "Growing\nCoverage" :
               "Early\nStage"}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Weighted Competencies</span>
          </div>
        </div>
      </div>

      {/* Card 2: Market Demand Match (Market Alignment) */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          <Flame className="h-4 w-4 text-amber-400" />
          Market Demand Match
        </h3>

        <div className="flex items-center gap-3.5 mt-3">
          <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ffffff10" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="url(#marketGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={marketOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{marketScore}%</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className={`text-xs font-bold leading-tight ${
              marketScore >= 70 ? "text-emerald-400" :
              marketScore >= 40 ? "text-amber-400" :
              "text-rose-400"
            }`}>
              {marketScore >= 70 ? "High Market\nAlignment" :
               marketScore >= 40 ? "Moderate\nAlignment" :
               "Market\nGap"}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Live Hiring Posts</span>
          </div>
        </div>
      </div>

      {/* Card 3: Role Universe */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          <Briefcase className="h-4 w-4 text-violet-400" />
          Role Universe
        </h3>

        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block tracking-tight">
            {displayRoleTotal}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            role-relevant skills defined for {targetRole}
          </span>
        </div>
      </div>

      {/* Card 4: Market Universe */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 sm:p-5 backdrop-blur-md">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
          <Flame className="h-4 w-4 text-amber-400" />
          Market Universe
        </h3>

        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block tracking-tight">
            {displayMarketTotal}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            current-demand skills in active listings
          </span>
        </div>
      </div>

    </div>
  );
}
