import { Code, Briefcase, Building, Target, Star, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  }
];

export default function InterviewHistory() {
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
    <div className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-6 text-sm font-semibold text-gray-400">Your Interview History</h3>
      
      {/* Table Header */}
      <div className="mb-4 grid grid-cols-12 gap-4 border-b border-white/5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        <div className="col-span-4">Role</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Score</div>
        <div className="col-span-2">Performance</div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Rows */}
      <div className="flex flex-col gap-4">
        {HISTORY.map((row, idx) => (
          <div key={idx} className="group grid grid-cols-12 items-center gap-4 cursor-pointer transition-colors hover:bg-white/[0.02] rounded-xl -mx-2 px-2 py-2">
            
            {/* Role & Icon */}
            <div className="col-span-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${row.iconBg}`}>
                <row.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">{row.role}</h4>
                <p className="text-[11px] text-gray-400 truncate">{row.desc}</p>
              </div>
            </div>

            {/* Type */}
            <div className="col-span-2">
              <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${row.typeColor}`}>
                {row.type}
              </span>
            </div>

            {/* Date */}
            <div className="col-span-2">
              <p className="text-xs text-white">{row.date}</p>
              <p className="text-[10px] text-gray-500">{row.time}</p>
            </div>

            {/* Score */}
            <div className="col-span-1">
              <span className={`text-sm font-bold ${row.scoreColor}`}>{row.score}</span>
            </div>

            {/* Performance */}
            <div className="col-span-2">
              {renderStars(row.stars)}
            </div>

            {/* Action */}
            <div className="col-span-1 flex justify-end">
              <ChevronRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <Link to="/history" className="flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300">
          View All Interviews <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
