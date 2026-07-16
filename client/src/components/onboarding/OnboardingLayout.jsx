import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bot, HelpCircle, LogOut, User, UploadCloud, Link as LinkIcon, Target, Shield, Check } from "lucide-react";

const STEPS = [
  { id: 1, title: "Welcome", desc: "Let's get you started", icon: Check },
  { id: 2, title: "Profile Setup", desc: "Tell us about yourself", icon: User },
  { id: 3, title: "Resume Upload", desc: "Upload your resume", icon: UploadCloud },
  { id: 4, title: "Connect Accounts", desc: "Connect GitHub & LinkedIn", icon: LinkIcon },
  { id: 5, title: "Target Role", desc: "Select your target role", icon: Target },
  { id: 6, title: "You're All Set!", desc: "Ready to explore", icon: Shield },
];

const INFO_CARDS = {
  1: {
    title: "100% Secure",
    desc: "Your data is safe with us and will never be shared.",
    icon: Shield,
  },
  2: {
    title: "Why do we need this?",
    desc: "This helps us personalize your experience and provide better recommendations.",
    icon: Bot, 
  },
  3: {
    title: "Your Data is Safe",
    desc: "We ensure your data is secure and never shared with anyone.",
    icon: Shield,
  },
  4: {
    title: "Your Data is Safe",
    desc: "We ensure your data is secure and never shared with anyone.",
    icon: Shield,
  },
  5: {
    title: "Your Data is Safe",
    desc: "We ensure your data is secure and never shared with anyone.",
    icon: Shield,
  },
  6: {
    title: "Your Data is Safe",
    desc: "We ensure your data is secure and never shared with anyone.",
    icon: Shield,
  },
};

export default function OnboardingLayout({ currentStep, children }) {
  const progressPercentage = ((currentStep) / STEPS.length) * 100;
  const activeInfo = INFO_CARDS[currentStep] || INFO_CARDS[1];

  return (
    <div className="relative flex min-h-screen flex-col bg-[#060816] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [-60, 40, -60], y: [-30, 50, -30] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-24 h-[520px] w-[520px] rounded-full bg-violet-700/10 blur-[180px]"
        />
        <motion.div
          animate={{ x: [40, -40, 40], y: [20, -40, 20] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-180px] top-0 h-[620px] w-[620px] rounded-full bg-fuchsia-700/5 blur-[200px]"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_0_30px_rgba(139,92,246,.3)]">
            <Bot className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            CareerPilot<span className="text-violet-400"> AI</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Need help?</span>
          </button>
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-4 md:flex-row md:py-8 lg:px-10">
        
        {/* Sidebar Navigation */}
        <div className="flex w-full flex-col gap-6 md:w-72 lg:w-80 shrink-0">
          
          {/* Progress Container */}
          <div className="rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between text-sm font-medium">
              <span className="text-violet-300">Onboarding Progress</span>
              <span className="text-gray-400">Step {currentStep} of 6</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
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
                      <div className="absolute left-[15px] top-8 bottom-[-8px] w-px border-l-2 border-dashed border-white/10 group-last:hidden" />
                    )}

                    {/* Step Number / Checkmark */}
                    <div className="relative z-10 flex w-12 shrink-0 flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                          isActive || isCompleted
                            ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                            : "bg-white/5 text-gray-500"
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="pb-6 w-full -mt-2">
                      <div
                        className={`flex items-center gap-4 rounded-xl p-3 transition-colors duration-300 ${
                          isActive ? "bg-violet-500/10 border border-violet-500/20" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300 ${
                            isActive
                              ? "bg-violet-500/20 text-violet-300"
                              : isCompleted
                              ? "text-violet-400"
                              : "text-gray-500"
                          }`}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${isActive || isCompleted ? "text-white" : "text-gray-400"}`}>
                            {step.title}
                          </h4>
                          <p className={`text-xs ${isActive ? "text-gray-300" : "text-gray-600"}`}>
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

          {/* Dynamic Info Card */}
          <div className="mt-auto rounded-[24px] border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md flex gap-3 items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 shrink-0">
              <activeInfo.icon className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-violet-300 mb-1">{activeInfo.title}</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                {activeInfo.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="rounded-[32px] border border-white/5 bg-white/[0.02] p-6 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-md md:p-10 flex-1">
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
}
