import { motion } from "framer-motion";
import { ArrowRight, Check, Briefcase, BookOpen, Mic, BarChart, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CompletedStep() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full flex-col items-center py-6"
    >
      <div className="text-center mb-8">
        <h1 className="mb-2 text-3xl font-black">You're All Set! 🎉</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
          Your onboarding is complete. You're ready to start your personalized career journey.
        </p>
      </div>

      {/* Success Animation Area */}
      <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
        {/* Animated rings */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
          className="absolute inset-[-20px] rounded-full border border-violet-500/30"
        />
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
          className="absolute inset-[-40px] rounded-full border border-violet-500/20"
        />
        
        {/* Checkmark icon */}
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-[0_0_40px_rgba(139,92,246,0.6)]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
          >
            <Check className="h-12 w-12 text-slate-900 dark:text-white" strokeWidth={3} />
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-md">

        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-4 font-bold text-slate-900 dark:text-white shadow-[0_0_30px_rgba(139,92,246,.3)] transition-all hover:shadow-[0_0_40px_rgba(139,92,246,.5)]"
        >
          Go to Dashboard <ArrowRight className="h-5 w-5" />
        </motion.button>
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-gray-500">Takes less than 2 minutes to explore</p>
      </div>
    </motion.div>
  );
}
