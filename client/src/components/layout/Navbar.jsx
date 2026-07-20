import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "Features",
      href: "#features",
    },
    {
      name: "How It Works",
      href: "#how-it-works",
    },
    {
      name: "Contact",
      href: "#contact",
    },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">

      <div className="mx-auto mt-3 w-[94%] max-w-7xl">

        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ boxShadow: "0 10px 40px rgba(139, 92, 246, 0.15)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-white dark:hover:bg-white/10"
        >

          <div className="flex h-16 items-center justify-between px-6">

            {/* Logo */}

            <a href="/" className="flex items-center gap-3">

              <motion.div
                whileHover={{
                  rotate: 10,
                  scale: 1.08,
                }}
                transition={{ duration: 0.2 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(139,92,246,0.2)]">
                <img src="/logo.jpg" alt="CareerPilot Logo" className="h-9 w-9 rounded-lg mix-blend-lighten" />
              </motion.div>

              <div>

                <h1 className="text-2xl font-extrabold tracking-tight">

                  CareerPilot

                  <span className="text-violet-400"> AI</span>

                </h1>

              </div>

            </a>

            {/* Desktop Navigation */}

            <div className="hidden items-center gap-10 md:flex">

              {links.map((link) => (

                <a
                  key={link.name}
                  href={link.href}
                  className="group relative text-[17px] font-medium text-slate-600 dark:text-gray-300 transition hover:text-slate-900 dark:text-white"
                >
                  {link.name}

                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-violet-500 transition-all duration-300 group-hover:w-full" />

                </a>

              ))}

            </div>

            {/* Right Side */}

            <div className="hidden items-center gap-4 md:flex">
              <a
                href="/login"
                className="rounded-xl border border-violet-500/40 px-6 py-3 text-[16px] font-semibold text-slate-900 dark:text-white transition-all duration-300 hover:border-violet-400 hover:bg-violet-600 hover:shadow-[0_0_25px_rgba(139,92,246,.45)]"
              >
                Login
              </a>
            </div>

            {/* Mobile Button */}

            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="text-slate-900 dark:text-white"
              >
                {open ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>

          {/* Mobile Menu */}

          <AnimatePresence>

            {open && (

              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden md:hidden"
              >

                <div className="space-y-5 border-t border-slate-200 dark:border-white/10 px-6 py-6">

                  {links.map((link) => (

                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block text-slate-600 dark:text-gray-300 transition hover:text-violet-400"
                    >
                      {link.name}
                    </a>

                  ))}

                  <a
                    href="/login"
                    className="mt-2 block rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 text-center font-semibold text-slate-900 dark:text-white"
                  >
                    Login
                  </a>

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </motion.nav>

      </div>

    </header>
  );
}