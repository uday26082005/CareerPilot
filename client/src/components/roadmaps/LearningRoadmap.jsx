import { Maximize2, Minimize2, CheckCircle2, CircleDashed, Circle, ChevronDown, Lock, Monitor, Layout, FileJson, Database, Rocket } from "lucide-react";

export default function LearningRoadmap() {
  const PHASES = [
    {
      num: 1,
      title: "Fundamentals",
      desc: "Build strong programming fundamentals.",
      status: "Completed",
      statusColor: "text-emerald-400 border-emerald-500/30",
      icon: Monitor,
      iconColor: "text-emerald-400 bg-emerald-500/10",
      themeColor: "bg-emerald-500",
      skills: ["HTML", "CSS", "JavaScript", "Git & GitHub", "Responsive Design"],
      progress: 100,
      tasks: "7 / 7 Tasks",
      progressIcon: CheckCircle2,
      progressColor: "text-emerald-500"
    },
    {
      num: 2,
      title: "Frontend Development",
      desc: "Learn modern frontend libraries and frameworks.",
      status: "In Progress",
      statusColor: "text-blue-400 border-blue-500/30",
      icon: Layout,
      iconColor: "text-blue-400 bg-blue-500/10",
      themeColor: "bg-blue-500",
      skills: ["React", "Redux", "Tailwind CSS", "Routing", "State Management"],
      progress: 60,
      tasks: "6 / 10 Tasks",
      progressIcon: CircleDashed,
      progressColor: "text-blue-500"
    },
    {
      num: 3,
      title: "Backend Development",
      desc: "Master server-side development and databases.",
      status: "In Progress",
      statusColor: "text-orange-400 border-orange-500/30",
      icon: FileJson,
      iconColor: "text-orange-400 bg-orange-500/10",
      themeColor: "bg-orange-500",
      skills: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Authentication"],
      progress: 30,
      tasks: "3 / 10 Tasks",
      progressIcon: CircleDashed,
      progressColor: "text-orange-500"
    },
    {
      num: 4,
      title: "Databases & DevOps",
      desc: "Work with databases and deploy applications.",
      status: "Pending",
      statusColor: "text-slate-500 dark:text-gray-400 border-gray-500/30",
      icon: Database,
      iconColor: "text-purple-400 bg-purple-500/10",
      themeColor: "bg-purple-500",
      skills: ["SQL", "MongoDB", "Docker", "CI/CD", "AWS Basics"],
      progress: 0,
      tasks: "0 / 9 Tasks",
      progressIcon: Circle,
      progressColor: "text-slate-400 dark:text-gray-500"
    },
    {
      num: 5,
      title: "Projects & Career Prep",
      desc: "Build projects and prepare for interviews.",
      status: "Pending",
      statusColor: "text-slate-500 dark:text-gray-400 border-gray-500/30",
      icon: Rocket,
      iconColor: "text-purple-400 bg-purple-500/10",
      themeColor: "bg-purple-500",
      skills: ["Full Stack Projects", "System Design", "DSA", "Mock Interviews"],
      progress: 0,
      tasks: "0 / 9 Tasks",
      progressIcon: Circle,
      progressColor: "text-slate-400 dark:text-gray-500"
    }
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-lg h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Your Learning Roadmap</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-gray-400 hover:text-gray-200 transition-colors">
            <Maximize2 className="h-3 w-3" /> Expand All
          </button>
          <button className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-gray-400 hover:text-gray-200 transition-colors">
            <Minimize2 className="h-3 w-3" /> Collapse All
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1">
        {PHASES.map((phase, idx) => (
          <div key={idx} className="relative flex gap-6 pb-8 last:pb-2">
            
            {/* Timeline Line & Circle */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-medium text-slate-400 dark:text-gray-500 mb-2">Phase {phase.num}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-slate-900 dark:text-white shadow-lg z-10 ${phase.themeColor}`}>
                {phase.num}
              </div>
              {idx < PHASES.length - 1 && (
                <div className="w-px flex-1 border-l border-dashed border-slate-300 dark:border-white/20 mt-2 mb-1" />
              )}
            </div>

            {/* Content Card */}
            <div className="flex-1 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-5 hover:bg-white dark:bg-white/[0.02] transition-colors mt-6 flex items-start gap-4">
              
              {/* Icon */}
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${phase.iconColor}`}>
                <phase.icon className="h-6 w-6" />
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{phase.title}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${phase.statusColor}`}>
                    {phase.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mb-4">{phase.desc}</p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {phase.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="rounded-md border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 px-2 py-1 text-[9px] font-medium text-slate-600 dark:text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Toggle */}
              <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                <div className="flex items-center gap-2">
                  <phase.progressIcon className={`h-4 w-4 ${phase.progressColor}`} />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{phase.progress}%</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-gray-400">{phase.tasks}</span>
                <button className="mt-4 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:text-white transition-colors">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

            </div>
            
          </div>
        ))}
      </div>

      {/* Add Custom Milestone */}
      <button className="mt-4 w-full rounded-xl border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/[0.01] py-4 text-xs font-bold text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:text-white transition-colors">
        + Add Custom Milestone
      </button>

      {/* Footer Note */}
      <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-400 dark:text-gray-500">
        <Lock className="h-3 w-3 shrink-0" />
        Roadmap is personalized based on your current skills and target role. Keep learning and track your progress!
      </div>
      
    </div>
  );
}
