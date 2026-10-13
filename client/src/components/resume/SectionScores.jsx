import { FileText, Briefcase, Code, Folder, GraduationCap, Award } from "lucide-react";

export default function SectionScores({ scores = {} }) {
  const SECTIONS = [
    { key: "summary", name: "Summary / Objective", icon: FileText, color: "bg-teal-500 dark:bg-[#4ee4cb]", iconBg: "bg-teal-50 border border-teal-200 dark:bg-[#4ee4cb]/15 dark:border-[#4ee4cb]/30", iconColor: "text-teal-600 dark:text-[#4ee4cb]" },
    { key: "experience", name: "Work Experience", icon: Briefcase, color: "bg-amber-500 dark:bg-[#ffd159]", iconBg: "bg-amber-50 border border-amber-200 dark:bg-[#ffd159]/15 dark:border-[#ffd159]/30", iconColor: "text-amber-600 dark:text-[#ffd159]" },
    { key: "skills", name: "Skills", icon: Code, color: "bg-purple-500 dark:bg-[#e29aff]", iconBg: "bg-purple-50 border border-purple-200 dark:bg-[#e29aff]/15 dark:border-[#e29aff]/30", iconColor: "text-purple-600 dark:text-[#e29aff]" },
    { key: "projects", name: "Projects", icon: Folder, color: "bg-rose-500 dark:bg-[#ff94aa]", iconBg: "bg-rose-50 border border-rose-200 dark:bg-[#ff94aa]/15 dark:border-[#ff94aa]/30", iconColor: "text-rose-600 dark:text-[#ff94aa]" },
    { key: "certifications", name: "Certifications", icon: Award, color: "bg-orange-500 dark:bg-[#ffb48a]", iconBg: "bg-orange-50 border border-orange-200 dark:bg-[#ffb48a]/15 dark:border-[#ffb48a]/30", iconColor: "text-orange-600 dark:text-[#ffb48a]" },
    { key: "education", name: "Education", icon: GraduationCap, color: "bg-blue-500 dark:bg-[#72c5ff]", iconBg: "bg-blue-50 border border-blue-200 dark:bg-[#72c5ff]/15 dark:border-[#72c5ff]/30", iconColor: "text-blue-600 dark:text-[#72c5ff]" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 shadow-sm dark:shadow-xl dark:shadow-black/25">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Section Scores</h3>
      
      <div className="flex flex-col gap-5">
        {SECTIONS.map((section, idx) => {
          const sectionData = scores[section.key] || { score: 0, feedback: "Not analyzed yet." };
          return (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${section.iconBg} ${section.iconColor}`}>
                  <section.icon className="h-4 w-4" />
                </div>
                
                {/* Info & Bar */}
                <div className="flex-1">
                  <div className="mb-1.5 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{section.name}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{sectionData.score}/100</span>
                  </div>
                  
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#242730] border border-slate-200 dark:border-white/[0.04]">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${section.color}`} 
                      style={{ width: `${sectionData.score}%` }} 
                    />
                  </div>
                </div>
              </div>
              {sectionData.feedback && (
                <p className="ml-12 text-xs text-slate-500 dark:text-slate-400">{sectionData.feedback}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
