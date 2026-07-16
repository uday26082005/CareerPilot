import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RoadmapWidget({ steps }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recommended Roadmap</h3>
        <Link to="/roadmaps" className="flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300">
          View Full Roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-between px-4 pb-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center flex-1">
            {/* Connector Line */}
            {idx !== steps.length - 1 && (
              <div 
                className={`absolute top-5 left-[50%] right-[-50%] h-[2px] -translate-y-1/2 ${
                  step.status === "completed" ? "bg-violet-600" : "bg-slate-200 dark:bg-white/10 border-t-2 border-dashed border-[#060816]"
                }`}
              />
            )}
            
            {/* Circle */}
            <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white dark:bg-[#0a0c1a] ${
              step.status === "completed" 
                ? "border-violet-600 bg-violet-600 text-slate-900 dark:text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                : step.status === "in_progress"
                ? "border-violet-500 text-violet-400"
                : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500"
            }`}>
              {step.status === "completed" ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
            </div>
            
            {/* Text */}
            <div className="mt-4 text-center">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white max-w-[80px]">{step.title}</h4>
              <p className={`mt-1 text-[10px] uppercase font-bold tracking-wider ${
                step.status === "completed" ? "text-slate-500 dark:text-gray-400" :
                step.status === "in_progress" ? "text-violet-400" : "text-slate-400 dark:text-gray-500"
              }`}>
                {step.status === "completed" ? "Completed" : step.status === "in_progress" ? "In Progress" : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
