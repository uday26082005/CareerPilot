import { useEffect } from "react";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 13) % 100}%`,
  left: `${(i * 47 + 23) % 100}%`,
  duration: 3 + ((i * 7) % 4),
  delay: (i * 0.3) % 2
}));

export default function AuthLayout({ backLink, children, aboveCard, belowCard }) {
  const { theme, toggleTheme } = useTheme();
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
      <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50 dark:bg-[#121316]">
        {/* Mouse Hover Glow (Flashlight effect) */}
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
          }}
          className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-[#ffd159]/10 blur-[140px] will-change-transform"
        />
        
        {/* Glowing Orbs */}
        <motion.div
          animate={{ x: [-80, 50, -80], y: [-50, 70, -50], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-[10%] top-[10%] h-[600px] w-[600px] rounded-full bg-[#ffd159]/10 blur-[160px]"
        />
        <motion.div
          animate={{ x: [80, -60, 80], y: [60, -40, 60], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#4ee4cb]/5 blur-[140px]"
        />
        <motion.div
          animate={{ x: [-40, 30, -40], y: [90, 10, 90] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[30%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-[#ffd159]/5 blur-[140px]"
        />

        {/* Floating Particles (Stars) */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#ffd159]/70 dark:bg-white/80 shadow-[0_0_10px_rgba(255,209,89,0.8)]"
            style={{
              top: p.top,
              left: p.left,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.8, 0.8]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Radial Gradient overlay to focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,0.8)_80%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(18,19,22,0.85)_100%)] pointer-events-none" />
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
            className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img src="/logo.png" alt="CareerPilot Logo" className="h-9 w-9 object-contain drop-shadow-sm" />
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CareerPilot<span className="text-amber-500 dark:text-[#ffd159]"> AI</span>
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
          {backLink && (
            <Link
              to={backLink.href}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 transition hover:text-amber-600 dark:hover:text-[#ffd159]"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLink.text}
            </Link>
          )}
        </div>
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
          <div className="absolute inset-0 -z-10 rounded-[36px] bg-[#ffd159]/10 blur-[100px]" />
          <div className="rounded-[32px] border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 md:p-7 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl">
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

