import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Building, BarChart, MapPin, Lightbulb } from "lucide-react";

export default function TargetRoleStep({ onNext, onPrev }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black">Target Role</h1>
        <p className="text-sm text-gray-400">
          Help us tailor the experience to your career goals by choosing your target role and preferences.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Target Role */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white">What role are you targeting?</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-violet-400" />
            </div>
            <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
              <option value="">Select your target role</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Full Stack Developer</option>
              <option value="data">Data Scientist</option>
              <option value="product">Product Manager</option>
            </select>
          </div>
        </div>

        {/* Preferred Industry */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white">Preferred Industry (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <Building className="h-4 w-4 text-violet-400" />
            </div>
            <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
              <option value="">Select industry</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance / Fintech</option>
              <option value="health">Healthcare</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white">Experience Level</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <BarChart className="h-4 w-4 text-violet-400" />
            </div>
            <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
              <option value="">Select your experience level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (3-5 years)</option>
              <option value="senior">Senior Level (5+ years)</option>
            </select>
          </div>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white">Employment Type (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-violet-400" />
            </div>
            <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
              <option value="">Select employment type</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Location Preference */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white">Location Preference (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-violet-400" />
            </div>
            <select className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-gray-400 outline-none transition-all focus:border-violet-500 focus:bg-white/10">
              <option value="">Select location preference</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex gap-4 items-start">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <Lightbulb className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h4 className="mb-1 text-sm font-bold text-violet-300">Why this helps?</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              This helps us generate personalized roadmaps, job recommendations, and interview questions that are most relevant to your goals.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
        >
          Save & Continue <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
