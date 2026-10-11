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

const STEP_ACCENTS = [
  { iconBg: "bg-[#4ee4cb]/15", iconText: "text-[#4ee4cb]", badgeBg: "bg-[#4ee4cb]", badgeText: "text-slate-950", borderHover: "hover:border-[#4ee4cb]/30" },
  { iconBg: "bg-[#ffd159]/15", iconText: "text-[#ffd159]", badgeBg: "bg-[#ffd159]", badgeText: "text-slate-950", borderHover: "hover:border-[#ffd159]/30" },
  { iconBg: "bg-[#e29aff]/15", iconText: "text-[#e29aff]", badgeBg: "bg-[#e29aff]", badgeText: "text-slate-950", borderHover: "hover:border-[#e29aff]/30" },
  { iconBg: "bg-[#ffb48a]/15", iconText: "text-[#ffb48a]", badgeBg: "bg-[#ffb48a]", badgeText: "text-slate-950", borderHover: "hover:border-[#ffb48a]/30" },
  { iconBg: "bg-[#ff94aa]/15", iconText: "text-[#ff94aa]", badgeBg: "bg-[#ff94aa]", badgeText: "text-slate-950", borderHover: "hover:border-[#ff94aa]/30" },
  { iconBg: "bg-[#72c5ff]/15", iconText: "text-[#72c5ff]", badgeBg: "bg-[#72c5ff]", badgeText: "text-slate-950", borderHover: "hover:border-[#72c5ff]/30" },
];

export default function HowItWorks() {

  return (

<section
id="how-it-works"
className="relative overflow-hidden py-20">

{/* Background */}

<div className="absolute inset-0 -z-10">

<div className="absolute left-10 top-24 h-80 w-80 rounded-full bg-[#ffd159]/5 blur-[140px]" />

<div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-[#4ee4cb]/5 blur-[130px]" />

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

<div className="flex items-center gap-2 rounded-full border border-[#ffd159]/20 bg-[#ffd159]/10 px-5 py-2 backdrop-blur-xl">

<Sparkles
size={16}
className="text-[#ffd159]"/>

<span className="text-sm font-semibold text-[#ffd159]">

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

className="mx-auto max-w-4xl text-center text-4xl font-black leading-tight lg:text-5xl text-white">

Your Journey

<br/>

<span className="bg-gradient-to-r from-[#ffd159] via-[#fed656] to-[#f5b82e] bg-clip-text text-transparent">

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

className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-slate-400">

CareerPilot guides you from resume analysis to interview preparation
through an intelligent AI-powered workflow.

</motion.p>

{/* Timeline */}

<div className="relative mx-auto mt-16 max-w-5xl">

{/* Line */}
<div className="absolute left-8 top-0 hidden h-[calc(100%-80px)] w-[2px] rounded-full bg-gradient-to-b from-[#ffd159]/40 via-white/10 to-transparent md:block"/>

<div className="space-y-8">

{

steps.map((step,index)=>{

const Icon=step.icon;
const accent=STEP_ACCENTS[index % STEP_ACCENTS.length];

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

              <div className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${accent.iconBg} ${accent.iconText} border border-white/[0.08] shadow-md shadow-black/20 backdrop-blur-md`}>

                <Icon className="h-7 w-7" />

                <span className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full ${accent.badgeBg} text-xs font-black ${accent.badgeText} shadow-sm`}>

                  {index + 1}

                </span>

              </div>

              {/* Card */}

              <motion.div

                whileHover={{
                  y: -6,
                  scale: 1.01,
                }}

                className={`flex-1 rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25 backdrop-blur-xl transition-all duration-300 ${accent.borderHover} hover:bg-[#20222a]`}

              >

                <h3 className="text-xl font-bold text-white">

                  {step.title}

                </h3>

                <p className="mt-3 leading-7 text-slate-400">

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