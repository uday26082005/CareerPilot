import { CheckCircle2, AlertCircle, XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SkillsBreakdown() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-6 text-sm font-semibold text-gray-400">Skills Breakdown</h3>
      
      <div className="flex-1 space-y-6">
        
        {/* Strong Skills */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Strong Skills</h4>
              <p className="text-[10px] text-gray-500">You have a good command on these skills.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {["HTML", "CSS", "JavaScript", "Git", "Problem Solving", "SQL"].map((skill, i) => (
              <span key={i} className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[10px] font-medium text-emerald-400">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Intermediate Skills */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Intermediate Skills</h4>
              <p className="text-[10px] text-gray-500">You have basic knowledge. Improve further.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {["React", "Node.js", "Express.js", "MongoDB"].map((skill, i) => (
              <span key={i} className="rounded-md border border-orange-500/20 bg-orange-500/5 px-2 py-1 text-[10px] font-medium text-orange-400">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Missing Skills</h4>
              <p className="text-[10px] text-gray-500">These are important for the target role.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-7">
            {["TypeScript", "Next.js", "Docker", "AWS", "System Design", "CI/CD", "Testing (Jest)"].map((skill, i) => (
              <span key={i} className="rounded-md border border-red-500/20 bg-red-500/5 px-2 py-1 text-[10px] font-medium text-red-400">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <Link to="/skills" className="flex items-center gap-2 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300">
          View All Skills <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
