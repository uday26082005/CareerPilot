import { useState } from "react";
import { Calendar, CheckCircle, Briefcase, ArrowRight } from "lucide-react";
import CalendarModal from "./CalendarModal";
import ScheduleEventModal from "./ScheduleEventModal";
import { Plus } from "lucide-react";

export default function UpcomingEvents({ events, onEventCreated }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

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
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <h3 className="mb-6 text-lg font-bold text-white tracking-wide">Upcoming</h3>
      
      <div className="flex-1 space-y-3.5">
        {events.slice(0, 5).map((event, idx) => (
          <div key={idx} className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-[#242730] p-4 transition-all duration-200 hover:bg-[#2b2f3a] hover:border-white/10 shadow-sm">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getBg(event.type)}`}>
              {getIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{event.title}</h4>
              <p className="mt-0.5 text-xs text-slate-400 truncate">{event.subtitle}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-white">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
        <button 
          onClick={() => setIsCalendarOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold text-[#4ee4cb] transition-colors hover:text-[#36e2b6]"
        >
          View Calendar <ArrowRight className="h-4 w-4" />
        </button>
        
        <button 
          onClick={() => setIsScheduleOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ffd159] to-[#fed656] px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition-all hover:brightness-105 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Event
        </button>
      </div>

      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        events={events} 
      />
      
      <ScheduleEventModal 
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onEventCreated={onEventCreated}
      />
    </div>
  );
}
