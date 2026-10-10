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
      <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#4ee4cb]" />
              Detected Skills
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified competencies found in your resume
            </p>
          </div>
          <span className="rounded-full bg-[#4ee4cb]/10 px-3 py-1 text-xs font-semibold text-[#4ee4cb] border border-[#4ee4cb]/20">
            {totalDetectedCount} Detected
          </span>
        </div>

        {/* 4 Category Filter Pills for Detected */}
        <div className="flex flex-wrap gap-1.5 py-1 mb-3">
          <button
            onClick={() => setDetectedFilter("core")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              detectedFilter === "core" 
                ? "bg-[#4ee4cb]/20 text-[#4ee4cb] border border-[#4ee4cb]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            Core ({coreDetected.length})
          </button>
          <button
            onClick={() => setDetectedFilter("important")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              detectedFilter === "important" 
                ? "bg-[#ffd159]/20 text-[#ffd159] border border-[#ffd159]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            Important ({importantDetected.length})
          </button>
          <button
            onClick={() => setDetectedFilter("supporting")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              detectedFilter === "supporting" 
                ? "bg-[#e29aff]/20 text-[#e29aff] border border-[#e29aff]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            Supporting ({supportingDetected.length})
          </button>
          <button
            onClick={() => setDetectedFilter("market")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              detectedFilter === "market" 
                ? "bg-[#ffb48a]/20 text-[#ffb48a] border border-[#ffb48a]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
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
                <span className="text-xs font-bold text-[#4ee4cb] flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Core Competencies Detected
                </span>
                <span className="rounded-full bg-[#4ee4cb]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#4ee4cb]">
                  {coreDetected.length}
                </span>
              </div>
              {coreDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {coreDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#4ee4cb]/20 bg-[#4ee4cb]/5 px-2.5 py-1 text-xs font-medium text-[#4ee4cb]"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-[#4ee4cb]/70 font-mono">
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
                <span className="text-xs font-bold text-[#ffd159] flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Important Production Skills Detected
                </span>
                <span className="rounded-full bg-[#ffd159]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#ffd159]">
                  {importantDetected.length}
                </span>
              </div>
              {importantDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {importantDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffd159]/20 bg-[#ffd159]/5 px-2.5 py-1 text-xs font-medium text-[#ffd159]"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-[#ffd159]/70 font-mono">
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
                <span className="text-xs font-bold text-[#e29aff] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#e29aff]" /> Supporting & Extended Skills Detected
                </span>
                <span className="rounded-full bg-[#e29aff]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#e29aff]">
                  {supportingDetected.length}
                </span>
              </div>
              {supportingDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {supportingDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e29aff]/20 bg-[#e29aff]/5 px-2.5 py-1 text-xs font-medium text-[#e29aff]"
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
                <span className="text-xs font-bold text-[#ffb48a] flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-[#ffb48a]" /> Current Market Demand Detected
                </span>
                <span className="rounded-full bg-[#ffb48a]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#ffb48a]">
                  {marketDetected.length}
                </span>
              </div>
              {marketDetected.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {marketDetected.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffb48a]/20 bg-[#ffb48a]/5 px-2.5 py-1 text-xs font-medium text-[#ffb48a]"
                    >
                      <span>{skill.name}</span>
                      {skill.isTrending && <span className="text-[10px] text-[#ffd159]">🔥</span>}
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
      <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#ffd159]" />
              Not Detected Skills
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Role and market skills to build for this profile
            </p>
          </div>
          <span className="rounded-full bg-[#ffd159]/10 px-3 py-1 text-xs font-semibold text-[#ffd159] border border-[#ffd159]/20">
            {totalGapsCount} Not Detected
          </span>
        </div>

        {/* 4 Category Filter Pills for Gaps */}
        <div className="flex flex-wrap gap-1.5 py-1 mb-3">
          <button
            onClick={() => setGapFilter("core")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              gapFilter === "core" 
                ? "bg-[#ff94aa]/20 text-[#ff94aa] border border-[#ff94aa]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            Core Gaps ({coreGaps.length})
          </button>
          <button
            onClick={() => setGapFilter("important")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              gapFilter === "important" 
                ? "bg-[#ffd159]/20 text-[#ffd159] border border-[#ffd159]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            Important Gaps ({importantGaps.length})
          </button>
          <button
            onClick={() => setGapFilter("supporting")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              gapFilter === "supporting" 
                ? "bg-[#e29aff]/20 text-[#e29aff] border border-[#e29aff]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            Supporting Gaps ({supportingGaps.length})
          </button>
          <button
            onClick={() => setGapFilter("market")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              gapFilter === "market" 
                ? "bg-[#ffb48a]/20 text-[#ffb48a] border border-[#ffb48a]/40 font-bold" 
                : "bg-[#242730] text-slate-400 hover:text-white border border-white/[0.06]"
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
                <span className="text-xs font-bold text-[#ff94aa] flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-[#ff94aa]" /> Core Role Gaps (High Relevance)
                </span>
                <span className="text-[10px] text-[#ff94aa] bg-[#ff94aa]/10 px-2 py-0.5 rounded-full font-semibold">
                  Priority Focus
                </span>
              </div>
              {coreGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {coreGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ff94aa]/20 bg-[#ff94aa]/5 px-2.5 py-1 text-xs font-medium text-[#ff94aa]"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-[#ff94aa]/70 font-mono">
                          {skill.category}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#4ee4cb] italic pl-5">All core competencies detected!</p>
              )}
            </div>
          )}

          {/* Category 2: Important Role Gaps */}
          {gapFilter === "important" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#ffd159] flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-[#ffd159]" /> Important Role Gaps
                </span>
                <span className="text-[10px] text-[#ffd159] bg-[#ffd159]/10 px-2 py-0.5 rounded-full font-semibold">
                  Production Level
                </span>
              </div>
              {importantGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {importantGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffd159]/20 bg-[#ffd159]/5 px-2.5 py-1 text-xs font-medium text-[#ffd159]"
                    >
                      <span>{skill.name}</span>
                      {skill.category && (
                        <span className="text-[10px] text-[#ffd159]/70 font-mono">
                          {skill.category}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#4ee4cb] italic pl-5">All important production skills detected!</p>
              )}
            </div>
          )}

          {/* Category 3: Supporting / Extended Skills */}
          {gapFilter === "supporting" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#e29aff] flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#e29aff]" /> Supporting & Extended Tools
                </span>
                <span className="text-[10px] text-[#e29aff] bg-[#e29aff]/10 px-2 py-0.5 rounded-full font-semibold">
                  Optional
                </span>
              </div>
              {supportingGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {supportingGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#e29aff]/20 bg-[#e29aff]/5 px-2.5 py-1 text-xs font-medium text-[#e29aff]"
                    >
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#4ee4cb] italic pl-5">All supporting tools detected!</p>
              )}
            </div>
          )}

          {/* Category 4: Current Market Gaps */}
          {gapFilter === "market" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#ffb48a] flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-[#ffb48a]" /> Current Market Demand Gaps
                </span>
                <span className="text-[10px] text-[#ffb48a] bg-[#ffb48a]/10 px-2 py-0.5 rounded-full font-semibold">
                  2026 Hiring
                </span>
              </div>
              {marketGaps.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {marketGaps.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffb48a]/20 bg-[#ffb48a]/5 px-2.5 py-1 text-xs font-medium text-[#ffb48a]"
                    >
                      <span>{skill.name}</span>
                      {skill.isTrending && <span className="text-[10px] text-[#ffd159]">🔥</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#4ee4cb] italic pl-5">All market demand skills detected!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
