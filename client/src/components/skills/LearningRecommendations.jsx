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
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md h-full">
      <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">Learning Recommendations</h3>
      
      <div className="grid gap-6 sm:grid-cols-3 flex-1">
        
        {/* Column 1: Courses */}
        <div className="flex flex-col">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-violet-400">
            <BookOpen className="h-5 w-5" /> Recommended Courses
          </h4>
          <div className="flex-1 space-y-3">
            {courses.length > 0 ? courses.map((item, i) => (
              <a href={item.url} target="_blank" rel="noreferrer" key={i} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-3 transition-colors hover:bg-white/80 dark:bg-white/[0.03] cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <MonitorPlay className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{item.type || "Course"}</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">Free</span>
              </a>
            )) : <span className="text-sm text-slate-500">No courses recommended.</span>}
          </div>
        </div>

        {/* Column 2: Projects */}
        <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/5 pt-4 sm:pt-0 sm:pl-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-blue-400">
            <Code className="h-5 w-5" /> Recommended Projects
          </h4>
          <div className="flex-1 space-y-3">
            {projects.length > 0 ? projects.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-3 transition-colors hover:bg-white/80 dark:bg-white/[0.03]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{item.difficulty || "Project"}</p>
                </div>
              </div>
            )) : <span className="text-sm text-slate-500">No projects recommended.</span>}
          </div>
        </div>

        {/* Column 3: Practice Questions */}
        <div className="flex flex-col gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/5 pt-4 sm:pt-0 sm:pl-6">
          <div className="flex items-center gap-2 text-emerald-400">
            <HelpCircle className="h-5 w-5" />
            <h4 className="text-sm font-bold">Practice Questions</h4>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {practice.length > 0 ? practice.map((item, idx) => (
              <Link 
                key={idx} 
                to={`/practice${item.topic_id ? `?topic=${item.topic_id}` : ''}`}
                className="group flex flex-col p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {item.topic_id ? TOPIC_NAMES[item.topic_id] : item.title}
                    </h5>
                  </div>
                </div>
              </Link>
            )) : <span className="text-sm text-slate-500">No practice resources recommended.</span>}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
            <Link to="/practice" className="flex items-center gap-2 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300">
              View All Questions <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
