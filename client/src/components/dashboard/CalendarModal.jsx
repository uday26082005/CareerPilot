import { useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function CalendarModal({ isOpen, onClose, events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[month];

  // Helper to check if an event matches a day
  const getEventsForDay = (day) => {
    return events.filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date);
      // Ensure the event matches the specific day, month, and year of the calendar
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const getEventColor = (type) => {
    switch (type) {
      case "interview": return "bg-violet-500 text-white";
      case "review": return "bg-emerald-500 text-white";
      case "assessment": return "bg-orange-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-[#060816]/60 backdrop-blur-md p-4 transition-all">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-white/[0.05] p-6 shadow-2xl backdrop-blur-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-violet-500" /> 
              {currentMonthName} {year}
            </h2>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={prevMonth} className="rounded-full bg-slate-200/50 dark:bg-white/10 p-2 text-slate-600 dark:text-white hover:bg-slate-300/50 dark:hover:bg-white/20 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextMonth} className="rounded-full bg-slate-200/50 dark:bg-white/10 p-2 text-slate-600 dark:text-white hover:bg-slate-300/50 dark:hover:bg-white/20 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="rounded-full bg-slate-200/50 dark:bg-white/10 p-2 text-slate-600 dark:text-white hover:bg-slate-300/50 dark:hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-7 gap-4 text-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
              <div key={d} className="hidden sm:block">{d}</div>
            ))}
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="block sm:hidden">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 rounded-xl border border-transparent"></div>
            ))}
            
            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              const dayEvents = getEventsForDay(day);

              return (
                <div 
                  key={day} 
                  className={`min-h-24 p-2 rounded-xl border transition-all flex flex-col
                    ${isToday 
                      ? 'border-violet-500/50 bg-violet-500/5 dark:bg-violet-500/10' 
                      : 'border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.04]'}
                  `}
                >
                  <div className={`text-right text-sm font-semibold mb-1 ${isToday ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {day}
                  </div>
                  
                  <div className="flex flex-col gap-1 overflow-y-auto">
                    {dayEvents.slice(0, 3).map((ev, eIdx) => (
                      <div key={eIdx} className={`text-[10px] sm:text-xs px-2 py-1 rounded-md cursor-pointer truncate hover:whitespace-normal hover:overflow-visible hover:break-words transition-all ${getEventColor(ev.type)}`}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium mt-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
