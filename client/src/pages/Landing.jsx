import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#060816] text-white">

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

      <footer
        id="contact"
        className="border-t border-white/10 py-10"
      >

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">

          <div>

            <h2 className="text-3xl font-black">

              CareerPilot

              <span className="text-violet-400">

                AI

              </span>

            </h2>

            <p className="mt-2 text-gray-400">

              Your AI-powered placement companion.

            </p>

          </div>

          <div className="flex gap-8 text-gray-400">

            <a
              href="#features"
              className="transition hover:text-violet-400"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-violet-400"
            >
              How It Works
            </a>

            <a
              href="/login"
              className="transition hover:text-violet-400"
            >
              Login
            </a>

          </div>

        </div>

        <p className="mt-8 text-center text-sm text-gray-500">

          © 2026 CareerPilot AI. All Rights Reserved.

        </p>

      </footer>

    </main>
  );
}