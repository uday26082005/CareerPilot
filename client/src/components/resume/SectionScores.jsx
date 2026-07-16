import { User, FileText, Briefcase, Code, Folder, GraduationCap } from "lucide-react";

const SECTIONS = [
  { name: "Contact & Personal Info", score: 95, icon: User, color: "bg-violet-500", iconColor: "text-violet-400" },
  { name: "Summary / Objective", score: 80, icon: FileText, color: "bg-blue-500", iconColor: "text-blue-400" },
  { name: "Work Experience", score: 88, icon: Briefcase, color: "bg-emerald-500", iconColor: "text-emerald-400" },
  { name: "Skills", score: 90, icon: Code, color: "bg-orange-500", iconColor: "text-orange-400" },
  { name: "Projects", score: 85, icon: Folder, color: "bg-purple-500", iconColor: "text-purple-400" },
  { name: "Education", score: 92, icon: GraduationCap, color: "bg-teal-500", iconColor: "text-teal-400" },
];

export default function SectionScores() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-6 text-sm font-semibold text-slate-500 dark:text-gray-400">Section Scores</h3>
      
      <div className="flex flex-col gap-5">
        {SECTIONS.map((section, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {/* Icon */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 ${section.iconColor}`}>
              <section.icon className="h-4 w-4" />
            </div>
            
            {/* Info & Bar */}
            <div className="flex-1">
              <div className="mb-1.5 flex justify-between">
                <span className="text-xs font-medium text-slate-900 dark:text-white">{section.name}</span>
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400">{section.score}/100</span>
              </div>
              
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div 
                  className={`h-full rounded-full ${section.color}`} 
                  style={{ width: `${section.score}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
