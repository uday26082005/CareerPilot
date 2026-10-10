import { FileText, Briefcase, Code, Folder, GraduationCap, Award } from "lucide-react";

export default function SectionScores({ scores = {} }) {
  const SECTIONS = [
    { key: "summary", name: "Summary / Objective", icon: FileText, color: "bg-[#4ee4cb]", iconBg: "bg-[#4ee4cb]/15 border border-[#4ee4cb]/30", iconColor: "text-[#4ee4cb]" },
    { key: "experience", name: "Work Experience", icon: Briefcase, color: "bg-[#ffd159]", iconBg: "bg-[#ffd159]/15 border border-[#ffd159]/30", iconColor: "text-[#ffd159]" },
    { key: "skills", name: "Skills", icon: Code, color: "bg-[#e29aff]", iconBg: "bg-[#e29aff]/15 border border-[#e29aff]/30", iconColor: "text-[#e29aff]" },
    { key: "projects", name: "Projects", icon: Folder, color: "bg-[#ff94aa]", iconBg: "bg-[#ff94aa]/15 border border-[#ff94aa]/30", iconColor: "text-[#ff94aa]" },
    { key: "certifications", name: "Certifications", icon: Award, color: "bg-[#ffb48a]", iconBg: "bg-[#ffb48a]/15 border border-[#ffb48a]/30", iconColor: "text-[#ffb48a]" },
    { key: "education", name: "Education", icon: GraduationCap, color: "bg-[#72c5ff]", iconBg: "bg-[#72c5ff]/15 border border-[#72c5ff]/30", iconColor: "text-[#72c5ff]" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-400">Section Scores</h3>
      
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
                    <span className="text-sm font-semibold text-white">{section.name}</span>
                    <span className="text-xs font-bold text-slate-400">{sectionData.score}/100</span>
                  </div>
                  
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#242730] border border-white/[0.04]">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${section.color}`} 
                      style={{ width: `${sectionData.score}%` }} 
                    />
                  </div>
                </div>
              </div>
              {sectionData.feedback && (
                <p className="ml-12 text-xs text-slate-400">{sectionData.feedback}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
