import { Bot, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthLayout({ backLink, children, aboveCard, belowCard }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 dark:bg-[#060816] text-slate-900 dark:text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <motion.div
          animate={{ x: [-60, 40, -60], y: [-30, 50, -30] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-24 h-[520px] w-[520px] rounded-full bg-violet-700/12 blur-[180px]"
        />
        <motion.div
          animate={{ x: [40, -40, 40], y: [20, -40, 20] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-180px] top-0 h-[620px] w-[620px] rounded-full bg-fuchsia-700/10 blur-[200px]"
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10"
      >
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_0_30px_rgba(139,92,246,.45)]"
          >
            <Bot className="h-6 w-6" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            CareerPilot<span className="text-violet-400"> AI</span>
          </h1>
        </Link>

        {backLink && (
          <Link
            to={backLink.href}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 transition hover:text-slate-900 dark:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLink.text}
          </Link>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-4">
        {aboveCard && (
          <div className="w-full max-w-md mb-3">
            {aboveCard}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full max-w-md"
        >
          <div className="absolute inset-0 -z-10 rounded-[36px] bg-violet-600/20 blur-[100px]" />
          <div className="rounded-[32px] border border-slate-200 dark:border-white/10 bg-white/[0.04] p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-xl">
            {children}
          </div>
        </motion.div>

        {belowCard && (
          <div className="w-full max-w-md mt-3">
            {belowCard}
          </div>
        )}
      </main>
    </div>
  );
}

