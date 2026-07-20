import { BarChart3 } from "lucide-react";
import BestCareerMatch from "../components/insights/BestCareerMatch";
import SalaryInsights from "../components/insights/SalaryInsights";
import TopCompaniesHiring from "../components/insights/TopCompaniesHiring";
import AICareerAdvisor from "../components/insights/AICareerAdvisor";
import KeyTakeaways from "../components/insights/KeyTakeaways";

export default function CareerInsights() {
  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Career Insights
          </h1>
          <p className="mt-1 text-base text-slate-500 dark:text-gray-400">
            Discover personalized career opportunities, market trends and actionable insights to achieve your goals.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6">
        
        {/* Row 1: Best Match & Salary Insights (60:40 ratio) */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BestCareerMatch />
          </div>
          <div className="lg:col-span-5">
            <SalaryInsights />
          </div>
        </div>

        {/* Row 2: Companies, Key Takeaways */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <TopCompaniesHiring />
          </div>
          <div className="lg:col-span-6">
            <KeyTakeaways />
          </div>
        </div>

        {/* Row 3: AI Advisor */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <AICareerAdvisor />
          </div>
        </div>

      </div>
      
    </div>
  );
}
