// Learning Recommendations Component with White and Dark mode support
import { BookOpen, Code, HelpCircle, MonitorPlay, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TOPIC_NAMES = {
  dsa: "Data Structures & Algorithms",
  frontend: "Frontend Development",
  backend: "Backend Development",
  system_design: "System Design",
  databases: "Databases",
  devops: "DevOps & Cloud"
};

export default function LearningRecommendations({ courses = [], projects = [], practice = [] }) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25 h-full">
      <h3 className="mb-6 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Learning Recommendations</h3>
      
      <div className="grid gap-6 sm:grid-cols-3 flex-1">
        
        {/* Column 1: Courses */}
        <div className="flex flex-col">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#D97706] dark:text-[#ffd159]">
            <BookOpen className="h-5 w-5" /> Recommended Courses
          </h4>
          <div className="flex-1 space-y-3">
            {courses.length > 0 ? courses.map((item, i) => (
              <a href={item.url} target="_blank" rel="noreferrer" key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/80 p-3.5 transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#242730] dark:hover:border-white/10 cursor-pointer shadow-2xs hover:shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7E6] text-[#D97706] border border-[#FDE7B0] dark:bg-[#ffd159]/10 dark:text-[#ffd159] dark:border-transparent">
                    <MonitorPlay className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.type || "Course"}</p>
                  </div>
                </div>
                <span className="rounded-full border border-teal-200 bg-[#F0FDFA] text-[#0D9488] dark:border-[#4ee4cb]/30 dark:bg-[#4ee4cb]/5 dark:text-[#4ee4cb] px-2.5 py-0.5 text-[11px] font-bold">Free</span>
              </a>
            )) : <span className="text-sm text-slate-500 dark:text-slate-400">No courses recommended.</span>}
          </div>
        </div>

        {/* Column 2: Projects */}
        <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/[0.06] pt-4 sm:pt-0 sm:pl-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0D9488] dark:text-[#4ee4cb]">
            <Code className="h-5 w-5" /> Recommended Projects
          </h4>
          <div className="flex-1 space-y-3">
            {projects.length > 0 ? projects.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/80 p-3.5 transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#242730] dark:hover:border-white/10 shadow-2xs hover:shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0D9488] border border-teal-200 dark:bg-[#4ee4cb]/10 dark:text-[#4ee4cb] dark:border-transparent">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.difficulty || "Project"}</p>
                </div>
              </div>
            )) : <span className="text-sm text-slate-500 dark:text-slate-400">No projects recommended.</span>}
          </div>
        </div>

        {/* Column 3: Practice Questions */}
        <div className="flex flex-col gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/[0.06] pt-4 sm:pt-0 sm:pl-6">
          <div className="flex items-center gap-2 text-[#7C3AED] dark:text-[#e29aff]">
            <HelpCircle className="h-5 w-5" />
            <h4 className="text-sm font-bold">Practice Questions</h4>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {practice.length > 0 ? practice.map((item, idx) => (
              <Link 
                key={idx} 
                to={`/practice${item.topic_id ? `?topic=${item.topic_id}` : ''}`}
                className="group flex flex-col p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/80 hover:border-purple-300 dark:border-white/[0.06] dark:bg-[#242730] dark:hover:border-[#e29aff]/30 transition-all duration-300 shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#7C3AED] border border-purple-200 dark:bg-[#e29aff]/10 dark:text-[#e29aff] group-hover:bg-purple-100/80 dark:group-hover:bg-[#e29aff]/20 transition-colors">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#ffd159] transition-colors leading-tight">
                      {item.topic_id ? `Practice ${TOPIC_NAMES[item.topic_id] || "Interview Skills"}` : item.title}
                    </h5>
                    {item.topic_id && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {TOPIC_NAMES[item.topic_id]}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )) : <span className="text-sm text-slate-500 dark:text-slate-400">No practice resources recommended.</span>}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.06]">
            <Link to="/practice" className="flex items-center gap-2 text-xs font-semibold text-[#0D9488] hover:text-teal-700 dark:text-[#4ee4cb] dark:hover:text-[#4ee4cb]/80 transition-colors">
              View All Questions <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
