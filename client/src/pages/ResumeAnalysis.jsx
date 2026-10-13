import { useEffect, useState } from "react";
import { RefreshCcw, Upload } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import OverallScore from "../components/resume/OverallScore";
import TopStrengths from "../components/resume/TopStrengths";
import SectionScores from "../components/resume/SectionScores";
import ATSCompatibility from "../components/resume/ATSCompatibility";
import KeySuggestions from "../components/resume/KeySuggestions";
import RecommendedKeywords from "../components/resume/RecommendedKeywords";
import RoleFitAnalysis from "../components/resume/RoleFitAnalysis";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ResumeAnalysis() {
  const { session } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!session?.access_token) return undefined;

    let isCurrent = true;
    const loadLatestAnalysis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resume/latest`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Unable to load your latest resume analysis.");
        }

        if (isCurrent) setAnalysis(payload.data);
      } catch (error) {
        if (isCurrent) setFeedback({ type: "error", message: error.message });
      }
    };

    loadLatestAnalysis();
    return () => {
      isCurrent = false;
    };
  }, [session?.access_token]);

  const submitResume = async (file) => {
    if (!session?.access_token) {
      setFeedback({ type: "error", message: "Please sign in before analyzing a resume." });
      return;
    }

    setIsAnalyzing(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Unable to analyze this resume.");
      }

      setAnalysis(payload.data);
      setFeedback({
        type: payload.data.analysisSource === "fallback" ? "error" : "success",
        message: payload.data.analysisWarning || payload.message,
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFeedback({ type: "error", message: "Please select a PDF resume." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: "error", message: "Resume file must not exceed 5 MB." });
      return;
    }

    submitResume(file);
  };

  const handleReanalyze = async () => {
    if (!session?.access_token) {
      setFeedback({ type: "error", message: "Please sign in before re-analyzing." });
      return;
    }
    
    setIsAnalyzing(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/reanalyze`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Unable to re-analyze resume.");
      }

      setAnalysis(payload.data);
      setFeedback({
        type: payload.data.analysisSource === "fallback" ? "error" : "success",
        message: payload.data.analysisWarning || payload.message,
      });
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Resume Analysis</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Get AI-powered insights to improve your resume and stand out to recruiters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReanalyze} 
            disabled={isAnalyzing} 
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1e24] px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-[#242730] hover:border-slate-300 dark:hover:border-white/20 active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <RefreshCcw className={`h-4 w-4 ${isAnalyzing ? "animate-spin text-amber-500 dark:text-[#ffd159]" : "text-slate-500 dark:text-slate-300"}`} /> 
            {isAnalyzing ? "Analyzing..." : "Re-analyze"}
          </button>
          <button 
            onClick={() => document.getElementById('resume-upload-input').click()}
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-4 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
          >
            <Upload className="h-4 w-4 stroke-[2.5]" /> Upload New Resume
          </button>
          <input type="file" id="resume-upload-input" className="hidden" accept="application/pdf,.pdf" onChange={handleUpload} />
        </div>
      </div>

      {feedback && (
        <p aria-live="polite" className={`text-sm font-medium ${feedback.type === "success" ? "text-teal-600 dark:text-[#4ee4cb]" : "text-rose-500 dark:text-rose-400"}`}>
          {feedback.message}
        </p>
      )}

      {/* Top Row: Score, ATS, Strengths */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1"><OverallScore score={analysis?.overallScore} summary={analysis?.overallSummary} /></div>
        <div className="lg:col-span-1"><ATSCompatibility score={analysis?.atsScore} status={analysis?.atsStatus} tips={analysis?.atsTips} /></div>
        <div className="lg:col-span-1"><TopStrengths strengths={analysis?.topStrengths} /></div>
      </div>

      {/* Middle Row: Sections, Suggestions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-1"><SectionScores scores={analysis?.sectionScores} /></div>
        <div className="lg:col-span-1"><KeySuggestions suggestions={analysis?.keySuggestions} /></div>
      </div>

      {/* Bottom Row: Keywords, Role Fit */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1"><RecommendedKeywords keywords={analysis?.recommendedKeywords} /></div>
        <div className="lg:col-span-2"><RoleFitAnalysis targetRole={analysis?.targetRole} roleFit={analysis?.roleFit} /></div>
      </div>

    </div>
  );
}
