import { Sparkles, Download } from "lucide-react";
import RoadmapOverview from "../components/roadmaps/RoadmapOverview";
import LearningRoadmap from "../components/roadmaps/LearningRoadmap";
import UpcomingTasks from "../components/roadmaps/UpcomingTasks";
import RecommendedResources from "../components/roadmaps/RecommendedResources";
import StayOnTrack from "../components/roadmaps/StayOnTrack";

export default function Roadmap() {
  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Your Personalized Roadmap <Sparkles className="h-5 w-5 text-violet-400" />
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Step-by-step plan to get you job-ready as a Full Stack Developer
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-300 transition-colors hover:bg-violet-500/20">
          <Download className="h-4 w-4" /> Download Roadmap
        </button>
      </div>

      {/* Top Overview */}
      <RoadmapOverview />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-8">
          <LearningRoadmap />
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <UpcomingTasks />
          <RecommendedResources />
          <StayOnTrack />
        </div>

      </div>

    </div>
  );
}
