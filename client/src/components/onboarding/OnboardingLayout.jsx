import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogOut, User, UploadCloud, Link as LinkIcon, Target, Shield, Check, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const STEPS = [
  { id: 1, title: "Profile Setup", desc: "Tell us about yourself", icon: User },
  { id: 2, title: "Connect Accounts", desc: "Connect GitHub & LinkedIn", icon: LinkIcon },
  { id: 3, title: "Target Role", desc: "Select your target role", icon: Target },
  { id: 4, title: "Resume Upload", desc: "Upload your resume", icon: UploadCloud },
  { id: 5, title: "You're All Set!", desc: "Ready to explore", icon: Shield },
];

export default function OnboardingLayout({ currentStep, children }) {
  const { theme, toggleTheme } = useTheme();
  const progressPercentage = ((currentStep) / STEPS.length) * 100;

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 dark:bg-[#121316] text-slate-900 dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [-60, 40, -60], y: [-30, 50, -30] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-24 h-[520px] w-[520px] rounded-full bg-[#ffd159]/10 blur-[180px]"
        />
        <motion.div
          animate={{ x: [40, -40, 40], y: [20, -40, 20] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-180px] top-0 h-[620px] w-[620px] rounded-full bg-[#4ee4cb]/5 blur-[200px]"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-300 hover:rotate-6 hover:scale-105">
            <img src="/logo.png" alt="CareerPilot Logo" className="h-9 w-9 object-contain drop-shadow-sm" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CareerPilot<span className="text-amber-500 dark:text-[#ffd159]"> AI</span>
          </h1>
        </div>

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

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500 dark:text-red-400 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-6 py-4 md:flex-row md:py-8 lg:px-10">
        
        {/* Sidebar Navigation */}
        <div className="flex w-full flex-col gap-6 md:w-72 lg:w-80 shrink-0">
          
          {/* Progress Container */}
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between text-base font-medium">
              <span className="text-slate-900 dark:text-white font-semibold">Onboarding Progress</span>
              <span className="text-slate-500 dark:text-slate-400">Step {currentStep} of 5</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#242730]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#ffd159] to-[#fed656] shadow-[0_0_15px_rgba(255,209,89,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {/* Vertical Stepper */}
            <div className="mt-8 flex flex-col">
              {STEPS.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const isLast = index === STEPS.length - 1;

                return (
                  <div key={step.id} className="relative flex min-h-[64px] group">
                    {/* Dashed Line */}
                    {!isLast && (
                      <div className="absolute left-[15px] top-8 bottom-[-8px] w-px border-l-2 border-dashed border-slate-200 dark:border-white/[0.08] group-last:hidden" />
                    )}

                    {/* Step Number / Checkmark */}
                    <div className="relative z-10 flex w-12 shrink-0 flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                          isActive || isCompleted
                            ? "bg-[#ffd159] text-slate-950 font-bold shadow-[0_0_15px_rgba(255,209,89,0.4)]"
                            : "bg-slate-100 text-slate-400 border border-slate-200 dark:bg-[#242730] dark:text-slate-500 dark:border-white/[0.08]"
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="pb-6 w-full -mt-2">
                      <div
                        className={`flex items-center gap-4 rounded-xl p-4 transition-colors duration-300 ${
                          isActive ? "bg-amber-50/80 border border-amber-200 dark:bg-[#ffd159]/10 dark:border-[#ffd159]/20" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${
                            isActive
                              ? "bg-amber-100 text-amber-700 dark:bg-[#ffd159]/20 dark:text-[#ffd159]"
                              : isCompleted
                              ? "text-amber-600 dark:text-[#ffd159]"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className={`text-base font-bold ${isActive || isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm ${isActive ? "text-slate-600 dark:text-slate-300" : "text-slate-500"}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-2xl dark:shadow-black/35 backdrop-blur-md md:p-10 flex-1">
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
}
