import { motion } from "framer-motion";
import { ArrowRight, Check, Briefcase, BookOpen, Mic, BarChart, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CompletedStep() {
  const navigate = useNavigate();

  const nextSteps = [
    { title: "AI Resume Analysis", desc: "Get insights and improve your resume", icon: Briefcase },
    { title: "Personalized Roadmaps", desc: "Get a step-by-step plan for your goals", icon: BookOpen },
    { title: "AI Mock Interviews", desc: "Practice and get real-time feedback", icon: Mic },
    { title: "Skill Gap Analysis", desc: "Identify gaps and upskill effectively", icon: BarChart },
    { title: "Career Insights", desc: "Discover trends and opportunities", icon: PieChart },
  ];

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
        <h3 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">What's Next?</h3>
        <p className="mb-6 text-center text-xs text-slate-500 dark:text-gray-400">
          Explore AI-powered tools and features designed to accelerate your career growth.
        </p>

        <div className="space-y-3 mb-10">
          {nextSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05] hover:border-violet-500/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20 group-hover:text-violet-300">
                  <step.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{step.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-violet-400" />
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={() => navigate("/")}
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
