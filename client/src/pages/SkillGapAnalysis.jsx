import SkillMetrics from "../components/skills/SkillMetrics";
import SkillRadarChart from "../components/skills/SkillRadarChart";
import SkillsBreakdown from "../components/skills/SkillsBreakdown";
import PrioritySkills from "../components/skills/PrioritySkills";
import LearningRecommendations from "../components/skills/LearningRecommendations";
import JobReadyEstimate from "../components/skills/JobReadyEstimate";

export default function SkillGapAnalysis() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Gap Analysis</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Compare your skills with job requirements and discover areas to improve.
        </p>
      </div>

      {/* Top Row: 5 Stat Cards (Metrics) */}
      <div>
        <SkillMetrics />
      </div>

      {/* Middle Row: Radar Chart, Breakdown, Priority */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SkillRadarChart />
        </div>
        <div className="lg:col-span-1">
          <SkillsBreakdown />
        </div>
        <div className="lg:col-span-1">
          <PrioritySkills />
        </div>
      </div>

      {/* Bottom Row: Learning Recs & Estimate */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <LearningRecommendations />
        </div>
        <div className="lg:col-span-1">
          <JobReadyEstimate />
        </div>
      </div>
    </div>
  );
}
