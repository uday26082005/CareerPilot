import { ArrowRight, Box, Code2, Database } from "lucide-react";
import { Link } from "react-router-dom";

export default function UpcomingTasks() {
  const TASKS = [
    { title: "Learn React Hooks", cat: "Frontend Development", icon: Code2, iconColor: "text-blue-400", status: "In Progress", statusColor: "text-blue-400 border-blue-500/30" },
    { title: "Build REST API with Node.js", cat: "Backend Development", icon: Box, iconColor: "text-emerald-400", status: "Next", statusColor: "text-orange-400 border-orange-500/30" },
    { title: "Connect MongoDB with Express", cat: "Backend Development", icon: Database, iconColor: "text-purple-400", status: "Next", statusColor: "text-orange-400 border-orange-500/30" },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-white/5 bg-[#0a0c1a] p-5 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-bold text-gray-300">Upcoming Tasks</h3>
        <Link to="#" className="text-[10px] font-medium text-violet-400 hover:text-violet-300 transition-colors">
          View All
        </Link>
      </div>

      <div className="flex flex-col space-y-3">
        {TASKS.map((task, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ${task.iconColor}`}>
                <task.icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-white mb-0.5">{task.title}</h4>
                <p className="text-[9px] text-gray-500">{task.cat}</p>
              </div>
            </div>
            <button className={`rounded-md border px-2 py-1 text-[9px] font-semibold transition-colors ${task.statusColor} hover:bg-white/5`}>
              {task.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
