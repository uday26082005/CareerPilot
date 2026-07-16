import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-[#060816] text-slate-900 dark:text-white">

      {/* Background */}

      <div className="fixed inset-0 -z-50">

        {/* Main Glows */}
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[160px]" />
        <div className="absolute right-1/4 top-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-[180px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(139,92,246,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,.15) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

      </div>

      <Navbar />

      {/* Hero */}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .8 }}
      >
        <Hero />
      </motion.section>

      {/* Features */}

      <div className="-mt-6">

        <FeaturesSection />

      </div>

      {/* How It Works */}

      <div className="-mt-8">

        <HowItWorks />

      </div>

      {/* Footer */}

      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070914] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 dark:text-gray-400">
            {/* Left: Brand */}
            <div className="flex-1 flex justify-start">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                CareerPilot<span className="text-violet-400"> AI</span>
              </h2>
            </div>
            
            {/* Middle: Copyright */}
            <div className="flex-1 text-center">
              <p>© 2026 CareerPilot AI. All Rights Reserved.</p>
            </div>

            {/* Right: Contact */}
            <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
              <a href="mailto:velhella.raga@gmail.com" className="transition hover:text-violet-400">velhella.raga@gmail.com</a>
              <span>+91-8008855138, +91-7989428396</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}