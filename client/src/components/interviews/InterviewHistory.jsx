import React, { useState } from "react";
import { Code, Briefcase, Building, Target, Star, ChevronDown, ChevronUp } from "lucide-react";

const HISTORY = [
  {
    role: "Frontend Developer",
    desc: "Technical Interview",
    type: "Technical",
    typeColor: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    date: "May 18, 2025",
    time: "10:30 AM",
    score: "85%",
    scoreColor: "text-emerald-400",
    stars: 4.5,
    icon: Code,
    iconBg: "bg-emerald-500/10 text-emerald-400"
  },
  {
    role: "Product Manager",
    desc: "Behavioral Interview",
    type: "Behavioral",
    typeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    date: "May 16, 2025",
    time: "04:15 PM",
    score: "72%",
    scoreColor: "text-orange-400",
    stars: 3.5,
    icon: Briefcase,
    iconBg: "bg-blue-500/10 text-blue-400"
  },
  {
    role: "Data Analyst",
    desc: "Role-specific Interview",
    type: "Role-specific",
    typeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    date: "May 14, 2025",
    time: "11:00 AM",
    score: "80%",
    scoreColor: "text-emerald-400",
    stars: 4,
    icon: Target,
    iconBg: "bg-orange-500/10 text-orange-400"
  },
  {
    role: "Software Engineer - Google",
    desc: "Company-specific",
    type: "Company",
    typeColor: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    date: "May 12, 2025",
    time: "02:45 PM",
    score: "68%",
    scoreColor: "text-orange-400",
    stars: 3.5,
    icon: Building,
    iconBg: "bg-violet-500/10 text-violet-400"
  },
  {
    role: "Backend Developer",
    desc: "System Design Interview",
    type: "Technical",
    typeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    date: "May 10, 2025",
    time: "09:00 AM",
    score: "75%",
    scoreColor: "text-emerald-400",
    stars: 4,
    icon: Code,
    iconBg: "bg-blue-500/10 text-blue-400"
  }
];

export default function InterviewHistory() {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedHistory = isExpanded ? HISTORY : HISTORY.slice(0, 3);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-3 w-3 ${star <= rating ? "fill-yellow-500 text-yellow-500" : star - 0.5 === rating ? "fill-yellow-500/50 text-yellow-500" : "fill-white/10 text-transparent"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md">
      <h3 className="mb-4 text-base font-semibold text-slate-500 dark:text-gray-400">Your Interview History</h3>
      
      {/* Table Header */}
      <div className="mb-3 grid grid-cols-12 gap-4 border-b border-slate-200 dark:border-white/5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
        <div className="col-span-7">Role</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-2">Score</div>
      </div>

      {/* Table Rows */}
      <div className="flex flex-col gap-2">
        {displayedHistory.map((row, idx) => (
          <div key={idx} className="group grid grid-cols-12 items-center gap-4 cursor-pointer transition-colors hover:bg-white dark:bg-white/[0.02] rounded-xl -mx-2 px-2 py-1.5">
            
            {/* Role & Icon */}
            <div className="col-span-7 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${row.iconBg}`}>
                <row.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-300 transition-colors truncate">{row.role}</h4>
                <p className="text-sm text-slate-500 dark:text-gray-400 truncate">{row.desc}</p>
              </div>
            </div>

            {/* Date */}
            <div className="col-span-3">
              <p className="text-sm text-slate-900 dark:text-white">{row.date}</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">{row.time}</p>
            </div>

            {/* Score */}
            <div className="col-span-2">
              <span className={`text-base font-bold ${row.scoreColor}`}>{row.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>View All Interviews <ChevronDown className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
