import { RefreshCcw, Upload } from "lucide-react";
import OverallScore from "../components/resume/OverallScore";
import TopStrengths from "../components/resume/TopStrengths";
import SectionScores from "../components/resume/SectionScores";
import ATSCompatibility from "../components/resume/ATSCompatibility";
import KeySuggestions from "../components/resume/KeySuggestions";
import RecommendedKeywords from "../components/resume/RecommendedKeywords";
import RoleFitAnalysis from "../components/resume/RoleFitAnalysis";

export default function ResumeAnalysis() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Resume Analysis</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Get AI-powered insights to improve your resume and stand out to recruiters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
            <RefreshCcw className="h-4 w-4" /> Re-analyze
          </button>
          <button 
            onClick={() => document.getElementById('resume-upload-input').click()}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors hover:bg-violet-500 shadow-lg shadow-violet-500/20"
          >
            <Upload className="h-4 w-4" /> Upload New Resume
          </button>
          <input type="file" id="resume-upload-input" className="hidden" />
        </div>
      </div>

      {/* Top Row: Score, ATS, Strengths */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1"><OverallScore /></div>
        <div className="lg:col-span-1"><ATSCompatibility /></div>
        <div className="lg:col-span-1"><TopStrengths /></div>
      </div>

      {/* Middle Row: Sections, Suggestions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-1"><SectionScores /></div>
        <div className="lg:col-span-1"><KeySuggestions /></div>
      </div>

      {/* Bottom Row: Keywords, Role Fit */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1"><RecommendedKeywords /></div>
        <div className="lg:col-span-2"><RoleFitAnalysis /></div>
      </div>

    </div>
  );
}
