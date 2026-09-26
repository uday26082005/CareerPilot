import { useState, useEffect } from "react";
import { RefreshCcw, Sparkles, TrendingUp, Globe } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import SkillMetrics from "../components/skills/SkillMetrics";
import SkillRadarChart from "../components/skills/SkillRadarChart";
import SkillsBreakdown from "../components/skills/SkillsBreakdown";
import PrioritySkills from "../components/skills/PrioritySkills";
import LearningRecommendations from "../components/skills/LearningRecommendations";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SkillGapAnalysis() {
  const { session } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!session?.access_token) return;

    let isCurrent = true;
    const loadLatestAnalysis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/skillgap/latest`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const payload = await response.json();

        if (response.ok && payload.success && payload.data) {
          if (isCurrent) setAnalysis(payload.data);
        } else if (response.status !== 404) {
          throw new Error(payload.message || "Failed to load skill gap analysis.");
        }
      } catch (error) {
        if (isCurrent) setFeedback({ type: "error", message: error.message });
      }
    };

    loadLatestAnalysis();
    return () => { isCurrent = false; };
  }, [session?.access_token]);

  const handleAnalyze = async () => {
    if (!session?.access_token) return;
    setIsAnalyzing(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/skillgap/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Unable to generate skill gap analysis.");
      }

      setAnalysis(payload.data);
      setFeedback({ type: "success", message: payload.message });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Gap Analysis</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Compare your skills with job requirements and discover areas to improve.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing} 
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors hover:bg-violet-500 shadow-lg shadow-violet-500/20"
          >
            <RefreshCcw className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} /> 
            {isAnalyzing ? "Analyzing..." : "Generate Analysis"}
          </button>
        </div>
      </div>

      {feedback && (
        <p aria-live="polite" className={`text-sm ${feedback.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
          {feedback.message}
        </p>
      )}

      {!analysis && !isAnalyzing && (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02]">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">No Analysis Found</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Click the button above to generate your first skill gap analysis.</p>
          </div>
        </div>
      )}

      {analysis && (
        <>
          {/* Market Intelligence Banner */}
          {analysis.analysis_json?.market_intelligence && (
            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/30 via-slate-900/60 to-blue-950/30 p-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Live 2026 Industry Market Intelligence
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Dynamic Market Extraction
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Skills are dynamically extracted from current hiring standards and live postings for <span className="text-violet-300 font-semibold">{analysis.role_name}</span>.
                    </p>
                  </div>
                </div>
                {analysis.analysis_json.market_intelligence.extracted_at && (
                  <span className="text-xs text-slate-500">
                    Updated {new Date(analysis.analysis_json.market_intelligence.extracted_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {analysis.analysis_json.market_intelligence.market_demand_summary && (
                <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.02] border border-white/5 rounded-xl p-3 mb-3">
                  {analysis.analysis_json.market_intelligence.market_demand_summary}
                </p>
              )}

              {analysis.analysis_json.market_intelligence.trending_technologies?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
                    Market Focus:
                  </span>
                  {analysis.analysis_json.market_intelligence.trending_technologies.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Top Row: 5 Stat Cards (Metrics) */}
          <div>
            <SkillMetrics 
              overallScore={analysis.skill_match_percentage} 
              targetRole={analysis.role_name} 
              totalSkills={analysis.matched_skills?.length + analysis.missing_skills?.length}
              matchedSkills={analysis.matched_skills?.length}
              missingSkills={analysis.missing_skills?.length}
            />
          </div>

          {/* Middle Row: Radar Chart, Breakdown, Priority */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SkillRadarChart 
                matchedSkills={analysis.matched_skills || []}
                missingSkills={analysis.missing_skills || []}
              />
            </div>
            <div className="lg:col-span-1">
              <SkillsBreakdown 
                strongSkills={analysis.matched_skills || []}
                missingSkills={analysis.missing_skills || []}
              />
            </div>
            <div className="lg:col-span-1">
              <PrioritySkills prioritySkills={analysis.priority_skills || []} />
            </div>
          </div>

          {/* Bottom Row: Learning Recs & Estimate */}
          <div className="w-full">
            <LearningRecommendations 
              courses={analysis.recommended_resources || []}
              projects={analysis.recommended_projects || []}
              practice={analysis.analysis_json?.practice_questions || []}
            />
          </div>
        </>
      )}


    </div>
  );
}
