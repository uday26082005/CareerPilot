import { Mic, Plus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-8 shadow-xl">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-transparent pointer-events-none" />
      <div className="absolute right-[-10%] top-[-10%] h-[120%] w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex h-full flex-col justify-between md:flex-row md:items-center">
        {/* Left Side: Text and Button */}
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Ready to practice?</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-6">
            Select a role and start your AI-powered mock interview.
          </p>
          <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500 shadow-lg shadow-violet-500/25">
            <Plus className="h-4 w-4" /> Start New Interview
          </button>
        </div>

        {/* Right Side: Graphic */}
        <div className="relative mt-8 flex shrink-0 items-center justify-center md:mt-0">
          
          {/* Animated sound waves */}
          <div className="absolute flex items-center justify-center gap-1 opacity-50">
            {[1, 2, 3, 2, 4, 2, 1, 3, 5, 2, 4, 1].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [h * 8, h * 15, h * 8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                className="w-1 rounded-full bg-violet-500/30"
              />
            ))}
          </div>
          
          {/* Central Mic Icon with deep glow */}
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-violet-400 to-violet-700 shadow-[0_0_50px_rgba(139,92,246,0.6)] border border-violet-300/30">
            <Mic className="h-10 w-10 text-slate-900 dark:text-white" />
          </div>

          {/* Floating chat bubble */}
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 -top-4 flex h-10 w-12 items-center justify-center rounded-xl rounded-bl-sm bg-[#1e2343] border border-slate-200 dark:border-white/10 shadow-xl"
          >
            <MessageSquare className="h-5 w-5 text-violet-400 fill-violet-400/20" />
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
