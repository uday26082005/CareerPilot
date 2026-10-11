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
      case "interview": return "bg-[#e29aff] text-slate-950 font-bold";
      case "review": return "bg-[#4ee4cb] text-slate-950 font-bold";
      case "assessment": return "bg-[#ffb48a] text-slate-950 font-bold";
      default: return "bg-[#72c5ff] text-slate-950 font-bold";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#1c1e24] p-6 shadow-2xl backdrop-blur-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-[#ffd159]" /> 
              {currentMonthName} {year}
            </h2>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={prevMonth} className="rounded-full bg-[#242730] p-2 text-slate-300 hover:bg-[#2b2f3a] hover:text-white transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={nextMonth} className="rounded-full bg-[#242730] p-2 text-slate-300 hover:bg-[#2b2f3a] hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="rounded-full bg-[#242730] p-2 text-slate-400 hover:bg-[#2b2f3a] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-7 gap-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
              <div key={d} className="hidden sm:block">{d}</div>
            ))}
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="block sm:hidden">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-3">
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
                      ? 'border-[#ffd159] bg-[#ffd159]/10 shadow-sm shadow-amber-500/10' 
                      : 'border-white/[0.06] bg-[#242730] hover:bg-[#2b2f3a] hover:border-white/10'}
                  `}
                >
                  <div className={`text-right text-sm font-semibold mb-1 ${isToday ? 'text-[#ffd159]' : 'text-slate-300'}`}>
                    {day}
                  </div>
                  
                  <div className="flex flex-col gap-1 overflow-y-auto">
                    {dayEvents.slice(0, 3).map((ev, eIdx) => (
                      <div key={eIdx} className={`text-[10px] sm:text-xs px-2 py-1 rounded-md cursor-pointer truncate hover:whitespace-normal hover:overflow-visible hover:break-words transition-all ${getEventColor(ev.type)}`}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-slate-400 text-center font-medium mt-1">
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
