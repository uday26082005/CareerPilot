import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import GithubIcon from "../../auth/GithubIcon";
import LinkedinIcon from "../../auth/LinkedinIcon";

export default function ConnectAccountsStep({ onNext, onPrev }) {
  const checkItem = (text) => (
    <div className="flex items-center gap-2">
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500/20">
        <Check className="h-3 w-3 text-violet-400" />
      </div>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black">Connect Accounts</h1>
        <p className="text-sm text-gray-400">
          Connect your GitHub and LinkedIn accounts to get personalized insights, project analysis, and better job recommendations.
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {/* GitHub Card */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg">
                <GithubIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Connect GitHub</h3>
            </div>
            <button className="flex items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 shadow-lg shadow-violet-500/20">
              <GithubIcon className="h-4 w-4 mr-2" /> Connect GitHub
            </button>
          </div>
          
          <p className="mb-4 text-sm text-gray-400">
            Analyze your repositories, contributions, and coding activity to showcase your technical skills.
          </p>
          
          <div className="flex flex-col gap-2">
            {checkItem("Project insights")}
            {checkItem("Skill improvement tips")}
            {checkItem("Better job matches")}
          </div>
        </div>

        {/* LinkedIn Card */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-lg shadow-blue-500/20">
                <LinkedinIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Connect LinkedIn</h3>
            </div>
            <button className="flex items-center rounded-lg bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#004182] shadow-lg shadow-blue-500/20">
              <LinkedinIcon className="h-4 w-4 mr-2 text-white" /> Connect LinkedIn
            </button>
          </div>
          
          <p className="mb-4 text-sm text-gray-400">
            Import your profile, experience, and network to get better career insights and opportunities.
          </p>
          
          <div className="flex flex-col gap-2">
            {checkItem("Profile insights")}
            {checkItem("Network recommendations")}
            {checkItem("Job opportunities")}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 flex gap-4 items-start">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
            <Lock className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h4 className="mb-1 text-sm font-bold text-violet-300">We respect your privacy</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              We only access the information required to provide you with the best experience. You can disconnect anytime.
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
