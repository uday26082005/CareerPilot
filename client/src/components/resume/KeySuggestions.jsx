import { Lightbulb } from "lucide-react";

export default function KeySuggestions({ suggestions = [] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-500 dark:text-[#ffd159]" /> Key Suggestions
      </h3>
      
      <div className="flex-1 space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((item, idx) => (
            <div key={idx} className="group flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 shadow-sm dark:border-white/[0.06] dark:bg-[#242730] dark:hover:border-white/15 dark:hover:bg-[#2b2f3a]">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#ffd159] transition-colors">{item.title}</h4>
                {item.priority && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.priority.toLowerCase() === 'high' 
                      ? 'bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-400' 
                      : item.priority.toLowerCase() === 'medium' 
                      ? 'bg-amber-50 border border-amber-200 text-amber-800 dark:bg-[#ffb48a]/15 dark:border-[#ffb48a]/30 dark:text-[#ffb48a]' 
                      : 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-[#72c5ff]/15 dark:border-[#72c5ff]/30 dark:text-[#72c5ff]'
                  }`}>
                    {item.priority}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
            No suggestions available.
          </div>
        )}
      </div>
    </div>
  );
}
