import { MonitorPlay, BookOpen, Target, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecommendedResources() {
  const RESOURCES = [
    { title: "React - The Complete Guide", src: "Udemy", type: "Course", icon: MonitorPlay, iconColor: "text-cyan-400 bg-cyan-500/10" },
    { title: "Node.js & Express - Bootcamp", src: "Udemy", type: "Course", icon: MonitorPlay, iconColor: "text-emerald-400 bg-emerald-500/10" },
    { title: "System Design Basics", src: "Educative", type: "Course", icon: Target, iconColor: "text-blue-400 bg-blue-500/10" },
    { title: "Full Stack Projects Ideas", src: "Blog", type: "Article", icon: FileText, iconColor: "text-slate-900 dark:text-white bg-slate-200 dark:bg-white/10" },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-5 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-bold text-slate-600 dark:text-gray-300">Recommended Resources</h3>
        <Link to="#" className="text-[10px] font-medium text-violet-400 hover:text-violet-300 transition-colors">
          View All
        </Link>
      </div>

      <div className="flex flex-col space-y-3">
        {RESOURCES.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-3 hover:bg-white/80 dark:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconColor}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white mb-0.5">{item.title}</h4>
                <p className="text-[9px] text-slate-400 dark:text-gray-500">{item.src}</p>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-violet-400">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
