import { BookOpen, Code, HelpCircle, MonitorPlay, Box, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LearningRecommendations() {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md h-full">
      <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">Learning Recommendations</h3>
      
      <div className="grid gap-6 sm:grid-cols-3 flex-1">
        
        {/* Column 1: Courses */}
        <div className="flex flex-col">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-violet-400">
            <BookOpen className="h-5 w-5" /> Recommended Courses
          </h4>
          <div className="flex-1 space-y-3">
            {[
              { title: "React - The Complete Guide", sub: "Academind", icon: MonitorPlay },
              { title: "Node.js & Express - Bootcamp", sub: "Udemy", icon: MonitorPlay },
              { title: "AWS Cloud Practitioner", sub: "AWS Training", icon: Box }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-3 transition-colors hover:bg-white/80 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{item.sub}</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">Beginner</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Projects */}
        <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/5 pt-4 sm:pt-0 sm:pl-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-blue-400">
            <Code className="h-5 w-5" /> Recommended Projects
          </h4>
          <div className="flex-1 space-y-3">
            {[
              { title: "Build a Full Stack Blog App", sub: "React, Node.js, MongoDB", icon: Code },
              { title: "E-commerce Website", sub: "MERN Stack, Stripe Integration", icon: MonitorPlay },
              { title: "Real-time Chat Application", sub: "Socket.io, Express, React", icon: MessageSquare }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-3 transition-colors hover:bg-white/80 dark:bg-white/[0.03]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Practice */}
        <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/5 pt-4 sm:pt-0 sm:pl-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400">
            <HelpCircle className="h-5 w-5" /> Practice Questions
          </h4>
          <div className="flex-1 space-y-3">
            {[
              { title: "Data Structures & Algorithms", sub: "120+ Questions", icon: HelpCircle },
              { title: "Frontend Development", sub: "80+ Questions", icon: HelpCircle },
              { title: "System Design Basics", sub: "50+ Questions", icon: HelpCircle }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-3 transition-colors hover:bg-white/80 dark:bg-white/[0.03]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
            <Link to="/practice" className="flex items-center gap-2 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300">
              View All Questions <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
