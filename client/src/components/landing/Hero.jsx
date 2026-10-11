import { motion } from "framer-motion";

import {
    ScanLine,
    Map,
    Mic,
    Radar,
    TrendingUp,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

import heroImageDark from "../../assets/hero-crossroads.jpeg";

const features = [
    { icon: ScanLine, text: "Resume Analysis", bg: "bg-[#4ee4cb]/15", textCol: "text-[#4ee4cb]", border: "hover:border-[#4ee4cb]/30" },
    { icon: Map, text: "AI Roadmap", bg: "bg-[#ffd159]/15", textCol: "text-[#ffd159]", border: "hover:border-[#ffd159]/30" },
    { icon: Mic, text: "Mock Interviews", bg: "bg-[#e29aff]/15", textCol: "text-[#e29aff]", border: "hover:border-[#e29aff]/30" },
    { icon: Radar, text: "Skill Gap Analysis", bg: "bg-[#ffb48a]/15", textCol: "text-[#ffb48a]", border: "hover:border-[#ffb48a]/30" },
    { icon: TrendingUp, text: "Progress Tracking", bg: "bg-[#ff94aa]/15", textCol: "text-[#ff94aa]", border: "hover:border-[#ff94aa]/30" },
    { icon: CheckCircle, text: "Placement Ready", bg: "bg-[#72c5ff]/15", textCol: "text-[#72c5ff]", border: "hover:border-[#72c5ff]/30" },
];

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-[110px] pb-8">
            {/* Background glowing orb for text */}
            <div className="absolute top-1/2 left-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#ffd159]/10 blur-[150px] pointer-events-none" />

            <div className="mx-auto w-[94%] max-w-7xl flex items-center justify-between px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16 w-full">
                    
                    {/* LEFT SIDE - Content */}
                    <div className="flex flex-col justify-center max-w-2xl">
                        
                        {/* Main Heading moved up */}

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="mt-0 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white"
                        >
                            Build Your <br />
                            Dream Career <br />
                            <span className="bg-gradient-to-r from-[#ffd159] via-[#fed656] to-[#f5b82e] bg-clip-text text-transparent drop-shadow-sm">
                                With AI
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                            className="mt-3 text-base sm:text-lg leading-relaxed text-slate-400"
                        >
                            CareerPilot AI analyzes your resume, identifies missing skills, creates a personalized learning roadmap, and conducts AI mock interviews to get you placement ready.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                            className="mt-5 flex flex-col sm:flex-row items-center gap-4"
                        >
                            <a
                                href="/signup"
                                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-8 py-4 font-bold text-slate-950 transition-all duration-300 shadow-lg shadow-amber-500/15 hover:brightness-105 active:scale-95 w-full sm:w-auto"
                            >
                                <span>Get Started for Free</span>
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>

                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-2xl border border-white/[0.08] bg-[#242730] px-8 py-4 font-bold text-slate-200 backdrop-blur-xl transition-all hover:bg-[#2b2f3a] hover:text-white hover:border-white/20 active:scale-95 w-full sm:w-auto"
                            >
                                Explore Features
                            </a>
                        </motion.div>

                        {/* Feature Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
                            className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3"
                        >
                            {features.map(({ icon: Icon, text, bg, textCol, border }) => (
                                <div
                                    key={text}
                                    className={`flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#1c1e24] px-4 py-3 shadow-md shadow-black/20 backdrop-blur-md transition-all ${border} hover:bg-[#20222a]`}
                                >
                                    <div className={`rounded-xl ${bg} p-2 ${textCol}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-200">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE - Image */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="relative flex justify-center items-center lg:justify-end"
                    >
                        {/* Glowing backdrop for image */}
                        <div className="absolute inset-0 max-w-[420px] max-h-[420px] m-auto rounded-full bg-[#ffd159]/10 blur-[120px] pointer-events-none" />
                        
                        <motion.img
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            src={heroImageDark}
                            alt="AI Career Mentor"
                            className="relative z-10 w-full max-w-[420px] object-cover rounded-3xl shadow-2xl shadow-black/50 border border-white/[0.08] mix-blend-screen"
                            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}