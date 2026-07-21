import { useState, useEffect, useRef } from "react";
import { Sparkles, Download, RefreshCcw } from "lucide-react";
import RoadmapOverview from "../components/roadmaps/RoadmapOverview";
import LearningRoadmap from "../components/roadmaps/LearningRoadmap";
import VisualRoadmapSummary from "../components/roadmaps/VisualRoadmapSummary";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Roadmap() {
  const { session } = useAuth();
  const visualRoadmapRef = useRef();
  
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestRoadmap = async () => {
    if (!session?.access_token) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/roadmap/latest`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRoadmap(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch roadmap:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRoadmap();
  }, [session?.access_token]);

  const generateRoadmap = async (isRegenerate = false) => {
    if (!session?.access_token) return;
    try {
      setIsGenerating(true);
      setError(null);
      const endpoint = isRegenerate ? "/roadmap/regenerate" : "/roadmap/generate";
      const method = isRegenerate ? "PUT" : "POST";
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate roadmap");
      }
      
      setRoadmap(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    if (!session?.access_token || !roadmap) return;
    
    // Optimistic update
    const updatedPhases = roadmap.phases.map(phase => {
      if (!phase.tasks) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      };
    });
    
    // We update local state immediately for snappy UI
    setRoadmap({ ...roadmap, phases: updatedPhases });
    
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap/task/${taskId}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        // Fetch latest to get updated percentages
        fetchLatestRoadmap();
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCcw className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02]">
          <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">No Roadmap Found</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 text-center max-w-md">
            Generate your personalized AI career roadmap based on your profile, resume, and skill gaps.
          </p>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <button 
            onClick={() => generateRoadmap(false)}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-500 shadow-lg shadow-violet-500/20"
          >
            {isGenerating ? (
              <><RefreshCcw className="h-4 w-4 animate-spin" /> Generating AI Roadmap...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate Roadmap</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Your Personalized Roadmap
          </h1>
          <p className="mt-1 text-base text-slate-500 dark:text-gray-400">
            Step-by-step plan to get you job-ready as a {roadmap.target_role}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => generateRoadmap(true)}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] px-4 py-2 text-sm font-bold text-slate-700 dark:text-gray-300 transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.05]"
          >
            <RefreshCcw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} /> 
            {isGenerating ? "Regenerating..." : "Regenerate"}
          </button>
          <button 
            onClick={() => {
              if (visualRoadmapRef.current) {
                visualRoadmapRef.current.generatePdf();
              }
            }}
            className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-300 transition-colors hover:bg-violet-500/20 print:hidden"
          >
            <Download className="h-5 w-5" /> Download PNG
          </button>
        </div>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Top Overview */}
      <RoadmapOverview roadmap={roadmap} />

      {/* Main Roadmap */}
      <div className="w-full">
        <LearningRoadmap roadmap={roadmap} onTaskStatusChange={handleTaskStatusChange} />
      </div>

      <VisualRoadmapSummary roadmap={roadmap} ref={visualRoadmapRef} />

    </div>
  );
}
