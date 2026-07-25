import { BarChart3, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import BestCareerMatch from "../components/insights/BestCareerMatch";
import SalaryInsights from "../components/insights/SalaryInsights";
import TopCompaniesHiring from "../components/insights/TopCompaniesHiring";
import AICareerAdvisor from "../components/insights/AICareerAdvisor";
import KeyTakeaways from "../components/insights/KeyTakeaways";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CareerInsights() {
  const { session } = useAuth();
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async (forceRegenerate = false) => {
    if (!session?.access_token) return;
    try {
      setIsLoading(true);
      setError(null);
      const endpoint = forceRegenerate ? `${API_BASE_URL}/insights/generate` : `${API_BASE_URL}/insights`;
      const method = forceRegenerate ? 'post' : 'get';
      const response = await axios({
        method,
        url: endpoint,
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setInsights(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load insights");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [session?.access_token]);
  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Career Insights
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Discover personalized career opportunities, market trends and actionable insights to achieve your goals.
          </p>
        </div>
        {insights && (
          <button 
            onClick={() => fetchInsights(true)}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors disabled:opacity-50 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg px-5 py-2.5 shadow-sm shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
            {isLoading ? "Regenerating..." : "Regenerate"}
          </button>
        )}
      </div>

      {/* Grid Layout */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
          <Loader2 className="h-10 w-10 text-violet-500 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI is analyzing your profile...</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 text-center max-w-md">
            We are aggregating your resume data, skill gaps, and career goals to generate highly personalized insights.
          </p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : insights ? (
        <div className="grid gap-6">
        
        {/* Row 1: Best Match & Salary Insights (60:40 ratio) */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BestCareerMatch data={insights} />
          </div>
          <div className="lg:col-span-5">
            <SalaryInsights data={insights} />
          </div>
        </div>

        {/* Row 2: Companies, Key Takeaways */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <TopCompaniesHiring data={insights} />
          </div>
          <div className="lg:col-span-6">
            <KeyTakeaways data={insights} />
          </div>
        </div>

        {/* Row 3: AI Advisor */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <AICareerAdvisor data={insights} onRegenerate={() => fetchInsights(true)} isLoading={isLoading} />
          </div>
        </div>

      </div>
      ) : null}
      
    </div>
  );
}
