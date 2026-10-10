import { Lightbulb } from "lucide-react";

export default function KeySuggestions({ suggestions = [] }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#ffd159]" /> Key Suggestions
      </h3>
      
      <div className="flex-1 space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((item, idx) => (
            <div key={idx} className="group flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-[#242730] p-3.5 transition-all duration-200 hover:border-white/15 hover:bg-[#2b2f3a] shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white group-hover:text-[#ffd159] transition-colors">{item.title}</h4>
                {item.priority && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.priority.toLowerCase() === 'high' 
                      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400' 
                      : item.priority.toLowerCase() === 'medium' 
                      ? 'bg-[#ffb48a]/15 border border-[#ffb48a]/30 text-[#ffb48a]' 
                      : 'bg-[#72c5ff]/15 border border-[#72c5ff]/30 text-[#72c5ff]'
                  }`}>
                    {item.priority}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-400 py-4 text-center">
            No suggestions available.
          </div>
        )}
      </div>
    </div>
  );
}
