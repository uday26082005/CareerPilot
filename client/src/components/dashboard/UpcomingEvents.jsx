import { Calendar, CheckCircle, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UpcomingEvents({ events }) {
  const getIcon = (type) => {
    switch (type) {
      case "interview": return <Calendar className="h-5 w-5 text-violet-400" />;
      case "review": return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "assessment": return <Briefcase className="h-5 w-5 text-orange-400" />;
      default: return <Calendar className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case "interview": return "bg-violet-500/10 border-violet-500/20";
      case "review": return "bg-emerald-500/10 border-emerald-500/20";
      case "assessment": return "bg-orange-500/10 border-orange-500/20";
      default: return "bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-6 text-lg font-bold text-white">Upcoming</h3>
      
      <div className="flex-1 space-y-4">
        {events.map((event, idx) => (
          <div key={idx} className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getBg(event.type)}`}>
              {getIcon(event.type)}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">{event.title}</h4>
              <p className="mt-0.5 text-xs text-gray-400">{event.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">{event.date}</p>
              <p className="mt-0.5 text-xs text-gray-500">{event.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <Link to="/calendar" className="flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300">
          View Calendar <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
