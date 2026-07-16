import { motion } from "framer-motion";
import { ArrowRight, FileText, BarChart, Code, Map, GitPullRequest, Briefcase } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Analysis",
    desc: "Get AI-powered feedback to improve your resume and stand out.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: BarChart,
    title: "Skill Gap Analysis",
    desc: "Discover your skill gaps and get actionable recommendations to fill them.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Code,
    title: "AI Mock Interviews",
    desc: "Practice with AI interviewers and get real-time feedback to boost confidence.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Map,
    title: "Personalized Roadmaps",
    desc: "Get a customized career roadmap tailored to your goals and skills.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: GitPullRequest,
    title: "GitHub & Project Review",
    desc: "Get insights and improve your projects to showcase your best work.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Career Insights",
    desc: "Explore job trends, salary insights, and industry opportunities.",
    color: "from-indigo-500 to-blue-500",
  },
];

export default function WelcomeStep({ onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-gray-400">Welcome to</h2>
        <h1 className="mb-4 text-4xl font-black tracking-tight">
          CareerPilot <span className="text-violet-400">AI</span>
        </h1>
        <p className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
          👋 Hi there! We're excited to have you on board.
        </p>
        <p className="max-w-2xl text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
          CareerPilot AI is your personal career companion that helps you analyze, plan, and accelerate your career journey with the power of artificial intelligence.
        </p>
      </div>

      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">What you can do with CareerPilot AI</h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]"
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
              <feature.icon className="h-5 w-5 text-slate-900 dark:text-white" />
            </div>
            <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{feature.title}</h4>
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-3">
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-4 font-bold text-slate-900 dark:text-white shadow-[0_0_30px_rgba(139,92,246,.3)] transition-all hover:shadow-[0_0_40px_rgba(139,92,246,.5)]"
        >
          Let's Get Started <ArrowRight className="h-5 w-5" />
        </motion.button>
        <p className="text-xs text-slate-400 dark:text-gray-500">Takes less than 2 minutes</p>
      </div>
    </motion.div>
  );
}
