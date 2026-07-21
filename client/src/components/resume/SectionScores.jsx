import { FileText, Briefcase, Code, Folder, GraduationCap, Award } from "lucide-react";

export default function SectionScores({ scores = {} }) {
  const SECTIONS = [
    { key: "summary", name: "Summary / Objective", icon: FileText, color: "bg-blue-500", iconColor: "text-blue-400" },
    { key: "experience", name: "Work Experience", icon: Briefcase, color: "bg-emerald-500", iconColor: "text-emerald-400" },
    { key: "skills", name: "Skills", icon: Code, color: "bg-orange-500", iconColor: "text-orange-400" },
    { key: "projects", name: "Projects", icon: Folder, color: "bg-purple-500", iconColor: "text-purple-400" },
    { key: "certifications", name: "Certifications", icon: Award, color: "bg-pink-500", iconColor: "text-pink-400" },
    { key: "education", name: "Education", icon: GraduationCap, color: "bg-teal-500", iconColor: "text-teal-400" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-6 text-base font-semibold text-slate-500 dark:text-gray-400">Section Scores</h3>
      
      <div className="flex flex-col gap-5">
        {SECTIONS.map((section, idx) => {
          const sectionData = scores[section.key] || { score: 0, feedback: "Not analyzed yet." };
          return (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 ${section.iconColor}`}>
                  <section.icon className="h-4 w-4" />
                </div>
                
                {/* Info & Bar */}
                <div className="flex-1">
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{section.name}</span>
                    <span className="text-sm font-bold text-slate-500 dark:text-gray-400">{sectionData.score}/100</span>
                  </div>
                  
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div 
                      className={`h-full rounded-full ${section.color}`} 
                      style={{ width: `${sectionData.score}%` }} 
                    />
                  </div>
                </div>
              </div>
              {sectionData.feedback && (
                <p className="ml-12 text-xs text-slate-500 dark:text-gray-400">{sectionData.feedback}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
