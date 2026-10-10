import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RoadmapWidget({ steps }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-wide">Recommended Roadmap</h3>
        <Link to="/roadmaps" className="flex items-center gap-2 text-sm font-semibold text-[#4ee4cb] transition-colors hover:text-[#36e2b6]">
          View Full Roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-between px-4 pb-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center flex-1">
            {/* Connector Line */}
            {idx !== steps.length - 1 && (
              <div 
                className={`absolute top-5 left-[50%] right-[-50%] h-[2px] -translate-y-1/2 transition-colors ${
                  step.status === "completed" 
                    ? "bg-[#4ee4cb]" 
                    : "border-t-2 border-dashed border-white/10"
                }`}
              />
            )}
            
            {/* Circle */}
            <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              step.status === "completed" 
                ? "bg-[#4ee4cb] text-slate-950 font-bold shadow-md shadow-teal-500/20" 
                : step.status === "in_progress"
                ? "border-2 border-[#ffd159] bg-[#242730] text-[#ffd159] ring-2 ring-[#ffd159]/20"
                : "border-2 border-white/10 bg-[#242730] text-slate-500"
            }`}>
              {step.status === "completed" ? (
                <Check className="h-5 w-5 stroke-[3]" />
              ) : (
                <span className="text-xs font-bold">{idx + 1}</span>
              )}
            </div>
            
            {/* Text */}
            <div className="mt-3 text-center">
              <h4 className="text-xs font-bold text-white max-w-[85px] leading-tight">{step.title}</h4>
              <p className={`mt-1 text-[10px] uppercase font-bold tracking-wider ${
                step.status === "completed" ? "text-[#4ee4cb]" :
                step.status === "in_progress" ? "text-[#ffd159]" : "text-slate-500"
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
