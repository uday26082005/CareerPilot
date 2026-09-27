import { useState } from "react";
import { CheckCircle2, AlertCircle, ShieldCheck, Sparkles, Flame, Layers } from "lucide-react";

export default function SkillsBreakdown({ 
  roleSkillsDetected = [],
  roleSkillsGaps = [],
  marketDemandSkills = [],
  categorizedGaps = null,
  relevanceBreakdown = null, 
  strongSkills = [], 
  missingSkills = [] 
}) {
  const [detectedFilter, setDetectedFilter] = useState("core"); // 'core' | 'important' | 'supporting' | 'market'
  const [gapFilter, setGapFilter] = useState("core"); // 'core' | 'important' | 'supporting' | 'market'

  // 1. Role Skills Detected (Strict subset of Role Taxonomy)
  const detectedList = (Array.isArray(roleSkillsDetected) && roleSkillsDetected.length > 0)
    ? roleSkillsDetected
    : (relevanceBreakdown?.highly_relevant || strongSkills).map(s => 
        typeof s === "string" ? { name: s, roleTier: "important", roleRelevance: "High" } : s
      );

  const coreDetected = detectedList.filter(s => s.roleTier === "core");
  const importantDetected = detectedList.filter(s => s.roleTier === "important");
  const supportingDetected = detectedList.filter(s => s.roleTier === "supporting" || (!s.roleTier && s.roleRelevance !== "High"));

  // Market Detected (4th Category in Detected Box)
  const marketDetected = (Array.isArray(marketDemandSkills) && marketDemandSkills.length > 0)
    ? marketDemandSkills.filter(s => s.isDetected || s.resumeDetected)
    : detectedList.filter(s => s.isMarketSkill);

  const totalDetectedCount = coreDetected.length + importantDetected.length + supportingDetected.length + marketDetected.length;

  // 2. Role Gaps (Strict subset of Role Taxonomy un-detected skills)
  const gapsList = (Array.isArray(roleSkillsGaps) && roleSkillsGaps.length > 0)
    ? roleSkillsGaps
    : (categorizedGaps ? [...(categorizedGaps.coreGaps || []), ...(categorizedGaps.importantGaps || []), ...(categorizedGaps.supportingGaps || [])] : missingSkills).map(s => 
        typeof s === "string" ? { name: s, roleTier: "important", status: "Not Detected" } : s
      );

  const coreGaps = (Array.isArray(categorizedGaps?.coreGaps) && categorizedGaps.coreGaps.length > 0)
    ? categorizedGaps.coreGaps
    : gapsList.filter(s => s.roleTier === "core");

  const importantGaps = (Array.isArray(categorizedGaps?.importantGaps) && categorizedGaps.importantGaps.length > 0)
    ? categorizedGaps.importantGaps
    : gapsList.filter(s => s.roleTier === "important");

  const supportingGaps = (Array.isArray(categorizedGaps?.supportingGaps) && categorizedGaps.supportingGaps.length > 0)
    ? categorizedGaps.supportingGaps
    : gapsList.filter(s => s.roleTier === "supporting" || (!s.roleTier && s.roleRelevance !== "High"));

  // Market Gaps (all un-detected market skills: 25 total - detected = gaps, e.g. 25 - 4 = 21)
  const marketGaps = (Array.isArray(categorizedGaps?.marketGaps) && categorizedGaps.marketGaps.length > 0)
    ? categorizedGaps.marketGaps
    : (Array.isArray(marketDemandSkills) && marketDemandSkills.length > 0)
      ? marketDemandSkills.filter(s => !(s.isDetected || s.resumeDetected))
      : gapsList.filter(s => s.isMarketSkill);

  const totalGapsCount = coreGaps.length + importantGaps.length + supportingGaps.length + marketGaps.length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Box 1: Detected Skills */}
      <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Detected Skills
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Verified competencies found in your resume
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            {totalDetectedCount} Detected
          </span>
        </div>

        {/* 4 Category Filter Pills for Detected */}
        <div className="flex flex-wrap gap-1.5 py-1 mb-3">
          <button
            onClick={() => setDetectedFilter("core")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              detectedFilter === "core" 
                ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-emerald-300"
            }`}
          >
            Core ({coreDetected.length})
          </button>
          <button
            onClick={() => setDetectedFilter("important")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              detectedFilter === "important" 
                ? "bg-blue-500/30 text-blue-300 border border-blue-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-blue-300"
            }`}
          >
            Important ({importantDetected.length})
          </button>
          <button
            onClick={() => setDetectedFilter("supporting")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              detectedFilter === "supporting" 
                ? "bg-slate-500/30 text-slate-300 border border-slate-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-slate-300"
            }`}
          >
            Supporting ({supportingDetected.length})
          </button>
          <button
            onClick={() => setDetectedFilter("market")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              detectedFilter === "market" 
                ? "bg-violet-500/30 text-violet-300 border border-violet-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-violet-300"
            }`}
          >
            Market ({marketDetected.length})
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 max-h-[420px]">
          {/* Category 1: Core Detected */}
          {detectedFilter === "core" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Core Competencies Detected
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  {coreDetected.length}
                </span>
              </div>
              {coreDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {coreDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-xs font-medium text-emerald-300"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-emerald-400/60 font-mono">
                          {skill.category}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pl-5">No core competencies detected in resume.</p>
              )}
            </div>
          )}

          {/* Category 2: Important Detected */}
          {detectedFilter === "important" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Important Production Skills Detected
                </span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400">
                  {importantDetected.length}
                </span>
              </div>
              {importantDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {importantDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/5 px-2.5 py-1 text-xs font-medium text-blue-300"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-blue-400/60 font-mono">
                          {skill.category}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pl-5">No important production skills detected in resume.</p>
              )}
            </div>
          )}

          {/* Category 3: Supporting Detected */}
          {detectedFilter === "supporting" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Supporting & Extended Skills Detected
                </span>
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-400">
                  {supportingDetected.length}
                </span>
              </div>
              {supportingDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {supportingDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 text-xs font-medium text-violet-300"
                    >
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pl-5">No supporting skills detected in resume.</p>
              )}
            </div>
          )}

          {/* Category 4: Market Detected */}
          {detectedFilter === "market" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-violet-400" /> Current Market Demand Detected
                </span>
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-400">
                  {marketDetected.length}
                </span>
              </div>
              {marketDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {marketDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 text-xs font-medium text-violet-300"
                    >
                      <span>{skill.name}</span>
                      {skill.isTrending && <span className="text-[10px] text-amber-400">🔥</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pl-5">No market demand skills detected in resume.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Box 2: Not Detected Skills (Role Gaps) */}
      <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              Not Detected Skills
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Role and market skills to build for this profile
            </p>
          </div>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
            {totalGapsCount} Not Detected
          </span>
        </div>

        {/* 4 Category Filter Pills for Gaps (All Role Gaps removed) */}
        <div className="flex flex-wrap gap-1.5 py-1 mb-3">
          <button
            onClick={() => setGapFilter("core")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              gapFilter === "core" 
                ? "bg-rose-500/30 text-rose-300 border border-rose-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-rose-300"
            }`}
          >
            Core Gaps ({coreGaps.length})
          </button>
          <button
            onClick={() => setGapFilter("important")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              gapFilter === "important" 
                ? "bg-amber-500/30 text-amber-300 border border-amber-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-amber-300"
            }`}
          >
            Important Gaps ({importantGaps.length})
          </button>
          <button
            onClick={() => setGapFilter("supporting")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              gapFilter === "supporting" 
                ? "bg-slate-500/30 text-slate-300 border border-slate-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-slate-300"
            }`}
          >
            Supporting Gaps ({supportingGaps.length})
          </button>
          <button
            onClick={() => setGapFilter("market")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              gapFilter === "market" 
                ? "bg-violet-500/30 text-violet-300 border border-violet-500/40" 
                : "bg-slate-800/40 text-slate-400 hover:text-violet-300"
            }`}
          >
            Market Gaps ({marketGaps.length})
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 max-h-[420px]">
          {/* Category 1: Core Role Gaps */}
          {gapFilter === "core" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> Core Role Gaps (High Relevance)
                </span>
                <span className="text-[10px] text-rose-400/80 bg-rose-500/10 px-1.5 py-0.2 rounded font-medium">
                  Priority Focus
                </span>
              </div>
              {coreGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {coreGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/5 px-2.5 py-1 text-xs font-medium text-rose-300"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-rose-400/60 font-mono">
                          {skill.category}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 italic pl-5">All core competencies detected!</p>
              )}
            </div>
          )}

          {/* Category 2: Important Role Gaps */}
          {gapFilter === "important" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400" /> Important Role Gaps
                </span>
                <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.2 rounded font-medium">
                  Production Level
                </span>
              </div>
              {importantGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {importantGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-xs font-medium text-amber-300"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-amber-400/60 font-mono">
                          {skill.category}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 italic pl-5">All important production skills detected!</p>
              )}
            </div>
          )}

          {/* Category 3: Supporting / Extended Skills */}
          {gapFilter === "supporting" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-slate-400" /> Supporting & Extended Tools
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-500/10 px-1.5 py-0.2 rounded font-medium">
                  Optional
                </span>
              </div>
              {supportingGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {supportingGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs text-slate-400"
                    >
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pl-5">All supporting tools detected!</p>
              )}
            </div>
          )}

          {/* Category 4: Current Market Gaps */}
          {gapFilter === "market" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-violet-400" /> Current Market Demand Gaps
                </span>
                <span className="text-[10px] text-violet-400/80 bg-violet-500/10 px-1.5 py-0.2 rounded font-medium">
                  2026 Hiring
                </span>
              </div>
              {marketGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {marketGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 text-xs font-medium text-violet-300"
                    >
                      <span>{skill.name}</span>
                      {skill.isTrending && <span className="text-[10px] text-amber-400">🔥</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 italic pl-5">All market demand skills detected!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
