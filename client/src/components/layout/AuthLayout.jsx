import { useState, useEffect } from "react";
import { Bot, ArrowLeft } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthLayout({ backLink, children, aboveCard, belowCard }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 300);
      mouseY.set(e.clientY - 300);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-slate-900 dark:text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50 dark:bg-[#060816]">
        {/* Mouse Hover Glow (Flashlight effect) */}
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
          }}
          className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-violet-500/20 dark:bg-violet-400/15 blur-[120px] will-change-transform"
        />
        
        {/* Glowing Orbs */}
        <motion.div
          animate={{ x: [-80, 50, -80], y: [-50, 70, -50], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-[10%] top-[10%] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[150px]"
        />
        <motion.div
          animate={{ x: [80, -60, 80], y: [60, -40, 60], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [-40, 30, -40], y: [90, 10, 90] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[30%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-600/15 blur-[130px]"
        />

        {/* Floating Particles (Stars) */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-violet-400/90 dark:bg-white/90 shadow-[0_0_15px_rgba(139,92,246,1)] dark:shadow-[0_0_15px_rgba(255,255,255,1)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.8, 0.8]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Radial Gradient overlay to focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,0.8)_80%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,8,22,0.9)_100%)] pointer-events-none" />
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
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(139,92,246,0.2)]">
            <img src="/logo.jpg" alt="CareerPilot Logo" className="h-9 w-9 rounded-lg mix-blend-lighten" />
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

