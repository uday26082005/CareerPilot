import { motion } from "framer-motion";
import {
  FileText,
  BarChart3,
  BookOpen,
  Mic,
  Target,
  Bot,
  Sparkles,
} from "lucide-react";

import FeatureCard from "../ui/FeatureCard";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description:
      "Upload your resume and receive ATS score, keyword optimization, strengths, weaknesses and AI-powered suggestions to improve your profile.",
  },

  {
    icon: BarChart3,
    title: "Skill Gap Detection",
    description:
      "Compare your current skills with industry requirements and instantly identify what you need to learn next.",
  },

  {
    icon: BookOpen,
    title: "Personalized Roadmap",
    description:
      "Receive a customized roadmap with learning resources, projects, certifications and daily goals.",
  },

  {
    icon: Mic,
    title: "AI Mock Interviews",
    description:
      "Practice HR, Technical and Coding interviews with realistic AI interviewers and receive instant feedback.",
  },

  {
    icon: Target,
    title: "Practice Arena",
    description:
      "Test your technical knowledge with topic-based practice quizzes, instant evaluations, detailed explanations, and accuracy tracking.",
  },

  {
    icon: Bot,
    title: "24/7 AI Mentor",
    description:
      "Ask career questions anytime and receive intelligent guidance for placements, resumes, projects and interviews.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-20"
    >
      {/* Background */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-[#ffd159]/5 blur-[130px]" />

        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#4ee4cb]/5 blur-[140px]" />

      </div>

      <div className="mx-auto max-w-7xl px-6">

        {/* Badge */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mb-5 flex justify-center"
        >

          <div className="flex items-center gap-2 rounded-full border border-amber-300 dark:border-[#ffd159]/20 bg-amber-50 dark:bg-[#ffd159]/10 px-5 py-2 backdrop-blur-xl">

            <Sparkles className="h-4 w-4 text-amber-600 dark:text-[#ffd159]" />

            <span className="text-sm font-semibold text-amber-700 dark:text-[#ffd159]">

              Powerful AI Features

            </span>

          </div>

        </motion.div>

        {/* Heading */}

        <motion.h2
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: .6,
          }}
          className="mx-auto max-w-4xl text-center text-4xl font-black leading-tight lg:text-5xl text-slate-900 dark:text-white"
        >

          Everything You Need

          <br />

          <span className="bg-gradient-to-r from-[#ffd159] via-[#fed656] to-[#f5b82e] bg-clip-text text-transparent">

            To Crack Your Dream Job

          </span>

        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            delay: .2,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-slate-600 dark:text-slate-400"
        >

          CareerPilot AI combines resume optimization,
          interview preparation, AI mentorship,
          coding practice and personalized learning
          into one intelligent placement platform.

        </motion.p>

        {/* Cards */}

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature, index) => (

            <FeatureCard
              key={feature.title}
              {...feature}
              index={index}
            />

          ))}

        </div>

        </div>
    </section>
  );
}