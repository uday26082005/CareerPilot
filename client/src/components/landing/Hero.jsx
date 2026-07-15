import { motion } from "framer-motion";

import {
    Sparkles,
    ScanLine,
    Map,
    Mic,
    Radar,
    TrendingUp,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

import heroImage from "../../assets/hero-crossroads.jpg";

const features = [
    { icon: ScanLine, text: "Resume Analysis" },
    { icon: Map, text: "AI Roadmap" },
    { icon: Mic, text: "Mock Interviews" },
    { icon: Radar, text: "Skill Gap Analysis" },
    { icon: TrendingUp, text: "Progress Tracking" },
    { icon: CheckCircle, text: "Placement Ready" },
];

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-[135px] pb-8">
            {/* Background glowing orb for text */}
            <div className="absolute top-1/2 left-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

            <div className="mx-auto w-[94%] max-w-7xl flex items-center justify-between px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24 w-full">
                    
                    {/* LEFT SIDE - Content */}
                    <div className="flex flex-col justify-center max-w-2xl">
                        
                        {/* Main Heading moved up */}

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                            className="mt-0 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white"
                        >
                            Build Your <br />
                            Dream Career <br />
                            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                                With AI
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                            className="mt-4 text-lg sm:text-xl leading-relaxed text-gray-400"
                        >
                            CareerPilot AI analyzes your resume, identifies missing skills, creates a personalized learning roadmap, and conducts AI mock interviews to get you placement ready.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                            className="mt-6 flex flex-col sm:flex-row items-center gap-5"
                        >
                            <a
                                href="/signup"
                                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,.5)] w-full sm:w-auto"
                            >
                                <span>Get Started for Free</span>
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>

                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 w-full sm:w-auto"
                            >
                                Explore Features
                            </a>
                        </motion.div>

                        {/* Feature Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
                            className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3"
                        >
                            {features.map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 backdrop-blur-md transition-all hover:border-violet-500/30 hover:bg-white/[0.05]"
                                >
                                    <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-[15px] font-semibold text-gray-200">
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
                        <div className="absolute inset-0 max-w-[500px] max-h-[500px] m-auto rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
                        
                        <motion.img
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            src={heroImage}
                            alt="AI Career Mentor"
                            className="relative z-10 w-full max-w-[500px] object-cover rounded-3xl shadow-[0_0_60px_rgba(139,92,246,0.15)] mix-blend-screen"
                            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}