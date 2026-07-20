import { Sparkles, Download } from "lucide-react";
import RoadmapOverview from "../components/roadmaps/RoadmapOverview";
import React, { useRef } from "react";
import LearningRoadmap from "../components/roadmaps/LearningRoadmap";
import VisualRoadmapSummary from "../components/roadmaps/VisualRoadmapSummary";

export default function Roadmap() {
  const visualRoadmapRef = useRef();

  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Your Personalized Roadmap
          </h1>
          <p className="mt-1 text-base text-slate-500 dark:text-gray-400">
            Step-by-step plan to get you job-ready as a Full Stack Developer
          </p>
        </div>
        <button 
          onClick={() => {
            if (visualRoadmapRef.current) {
              visualRoadmapRef.current.generatePdf();
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-300 transition-colors hover:bg-violet-500/20 print:hidden"
        >
          <Download className="h-5 w-5" /> Download Roadmap
        </button>
      </div>

      {/* Top Overview */}
      <RoadmapOverview />

      {/* Main Roadmap */}
      <div className="w-full">
        <LearningRoadmap />
      </div>

      <VisualRoadmapSummary ref={visualRoadmapRef} />

    </div>
  );
}
