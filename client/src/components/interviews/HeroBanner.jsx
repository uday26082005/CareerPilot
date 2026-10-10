import { Mic, Plus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroBanner({ onStart, activeInterview, onResume }) {
  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ffd159]/5 to-transparent pointer-events-none" />
      <div className="absolute right-[-10%] top-[-10%] h-[120%] w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffd159]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex h-full flex-col justify-between md:flex-row md:items-center">
        {/* Left Side: Text and Button */}
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Ready to practice?</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Select a role and start your AI-powered mock interview.
          </p>
          {activeInterview ? (
            <button onClick={onResume} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffb48a] to-[#ff9462] px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md transition-all hover:brightness-105 active:scale-95">
              <Plus className="h-4 w-4 stroke-[2.5]" /> Resume Pending Interview
            </button>
          ) : (
            <button onClick={onStart} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95">
              <Plus className="h-4 w-4 stroke-[2.5]" /> Start New Interview
            </button>
          )}
        </div>

        {/* Right Side: Graphic */}
        <div className="relative mt-8 flex shrink-0 items-center justify-center md:mt-0 md:mx-auto">
          
          {/* Animated sound waves */}
          <div className="absolute flex items-center justify-center gap-1 opacity-60">
            {[1, 2, 3, 2, 4, 2, 1, 3, 5, 2, 4, 1].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [h * 8, h * 15, h * 8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                className="w-1 rounded-full bg-[#ffd159]/40"
              />
            ))}
          </div>
          
          {/* Central Mic Icon with deep glow */}
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd159] via-[#fed656] to-[#f5b82e] shadow-[0_0_35px_rgba(255,209,89,0.25)] border border-amber-300/40 text-slate-950">
            <Mic className="h-10 w-10 text-slate-950 stroke-[2.2]" />
          </div>

          {/* Floating chat bubble */}
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 -top-4 flex h-10 w-12 items-center justify-center rounded-xl rounded-bl-sm bg-[#242730] border border-white/10 shadow-xl"
          >
            <MessageSquare className="h-5 w-5 text-[#ffd159] fill-[#ffd159]/20" />
            <div className="absolute flex gap-1 items-center">
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
