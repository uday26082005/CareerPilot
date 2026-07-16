import { motion } from "framer-motion";

import {
  UploadCloud,
  Target,
  Brain,
  Map,
  Mic,
  Trophy,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload Resume",
    description:
      "Upload your resume and let CareerPilot AI analyze your skills, projects and experience.",
  },

  {
    icon: Target,
    title: "Choose Target Role",
    description:
      "Select your dream company or role and let AI personalize everything accordingly.",
  },

  {
    icon: Brain,
    title: "AI Skill Analysis",
    description:
      "Discover your strengths, weaknesses and missing skills through intelligent analysis.",
  },

  {
    icon: Map,
    title: "Learning Roadmap",
    description:
      "Receive a personalized roadmap containing courses, projects and milestones.",
  },

  {
    icon: Mic,
    title: "Mock Interviews",
    description:
      "Practice HR and Technical interviews with instant AI feedback and improvement tips.",
  },

  {
    icon: Trophy,
    title: "Placement Ready",
    description:
      "Track your progress and become fully prepared for placements with confidence.",
  },
];

export default function HowItWorks() {

  return (

<section
id="how-it-works"
className="relative overflow-hidden py-20">

{/* Background */}

<div className="absolute inset-0 -z-10">

<div className="absolute left-10 top-24 h-80 w-80 rounded-full bg-violet-700/8 blur-[140px]" />

<div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-fuchsia-700/8 blur-[130px]" />

</div>

<div className="mx-auto max-w-6xl px-6">

{/* Badge */}

<motion.div

initial={{
opacity:0,
y:20
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

className="mb-5 flex justify-center">

<div className="flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-5 py-2 backdrop-blur-xl">

<Sparkles
size={16}
className="text-violet-300"/>

<span className="text-sm font-semibold text-violet-300">

Simple Process

</span>

</div>

</motion.div>

{/* Heading */}

<motion.h2

initial={{
opacity:0,
y:25
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

className="mx-auto max-w-4xl text-center text-4xl font-black leading-tight lg:text-5xl">

Your Journey

<br/>

<span className="bg-gradient-to-r from-violet-300 via-violet-500 to-fuchsia-400 bg-clip-text text-transparent">

Towards Success

</span>

</motion.h2>

<motion.p

initial={{
opacity:0
}}

whileInView={{
opacity:1
}}

transition={{
delay:.2
}}

viewport={{
once:true
}}

className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-slate-500 dark:text-gray-400">

CareerPilot guides you from resume analysis to interview preparation
through an intelligent AI-powered workflow.

</motion.p>

{/* Timeline */}

<div className="relative mx-auto mt-16 max-w-5xl">

{/* Line */}
<div className="absolute left-8 top-0 hidden h-[calc(100%-80px)] w-[4px] rounded-full bg-gradient-to-b from-violet-500 to-purple-700 md:block"/>

<div className="space-y-8">

{

steps.map((step,index)=>{

const Icon=step.icon;

return(

<motion.div

key={step.title}

initial={{
opacity:0,
x:index%2===0?-30:30
}}

whileInView={{
opacity:1,
x:0
}}

viewport={{
once:true
}}

transition={{
duration:.6,
delay:index*.08
}}

className="relative flex flex-col gap-5 md:flex-row">
                {/* Icon */}

              <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_0_30px_rgba(139,92,246,.35)]">

                <Icon className="h-7 w-7 text-slate-900 dark:text-white" />

                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-violet-700">

                  {index + 1}

                </span>

              </div>

              {/* Card */}

              <motion.div

                whileHover={{
                  y: -6,
                  scale: 1.01,
                }}

                className="flex-1 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_15px_40px_rgba(139,92,246,.15)]"

              >

                <h3 className="text-xl font-bold">

                  {step.title}

                </h3>

                <p className="mt-3 leading-7 text-slate-500 dark:text-gray-400">

                  {step.description}

                </p>

              </motion.div>

            </motion.div>

          );

        })}

      </div>

    </div>

    {/* Bottom CTA Removed */}

  </div>

</section>

  );

}