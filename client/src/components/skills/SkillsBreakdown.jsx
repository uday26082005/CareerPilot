import { CheckCircle2, AlertCircle, XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SkillsBreakdown({ strongSkills = [], missingSkills = [] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-base font-semibold text-slate-500 dark:text-gray-400">Skills Breakdown</h3>
      
      <div className="flex-1 flex flex-col justify-start gap-8 mt-2">
        
        {/* Strong Skills */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Strong Skills</h4>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            {strongSkills.length > 0 ? strongSkills.map((skill, i) => (
              <span key={i} className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-xs font-medium text-emerald-400">
                {skill}
              </span>
            )) : <span className="text-xs text-slate-500">No matched skills.</span>}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Missing Skills</h4>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
              <span key={i} className="rounded-md border border-red-500/20 bg-red-500/5 px-2 py-1 text-xs font-medium text-red-400">
                {skill}
              </span>
            )) : <span className="text-xs text-slate-500">No missing skills.</span>}
          </div>
        </div>

      </div>
    </div>
  );
}
