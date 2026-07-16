import { BarChart3, Download } from "lucide-react";
import BestCareerMatch from "../components/insights/BestCareerMatch";
import JobMarketDemand from "../components/insights/JobMarketDemand";
import SalaryInsights from "../components/insights/SalaryInsights";
import TopCompaniesHiring from "../components/insights/TopCompaniesHiring";
import IndustryTrends from "../components/insights/IndustryTrends";
import AICareerAdvisor from "../components/insights/AICareerAdvisor";
import KeyTakeaways from "../components/insights/KeyTakeaways";

export default function CareerInsights() {
  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Career Insights <BarChart3 className="h-6 w-6 text-violet-400" />
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Discover personalized career opportunities, market trends and actionable insights to achieve your goals.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10">
          <Download className="h-4 w-4" /> Download Report
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6">
        
        {/* Row 1: Best Match & Job Demand */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BestCareerMatch />
          </div>
          <div className="lg:col-span-5">
            <JobMarketDemand />
          </div>
        </div>

        {/* Row 2: Salary, Companies, Trends */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SalaryInsights />
          </div>
          <div className="lg:col-span-4">
            <TopCompaniesHiring />
          </div>
          <div className="lg:col-span-4">
            <IndustryTrends />
          </div>
        </div>

        {/* Row 3: AI Advisor & Takeaways */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AICareerAdvisor />
          </div>
          <div className="lg:col-span-5">
            <KeyTakeaways />
          </div>
        </div>

      </div>
      
    </div>
  );
}
