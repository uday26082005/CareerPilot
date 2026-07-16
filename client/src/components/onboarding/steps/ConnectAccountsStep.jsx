import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import toast from "react-hot-toast";
import GithubIcon from "../../auth/GithubIcon";
import LinkedinIcon from "../../auth/LinkedinIcon";

export default function ConnectAccountsStep({ onNext, onPrev }) {
  const [githubConnected, setGithubConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);

  const handleGithubConnect = () => {
    if (githubConnected) return;
    const loadingToast = toast.loading("Connecting to GitHub...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      setGithubConnected(true);
      toast.success("GitHub account connected successfully!");
    }, 1200);
  };

  const handleLinkedinConnect = () => {
    if (linkedinConnected) return;
    const loadingToast = toast.loading("Connecting to LinkedIn...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      setLinkedinConnected(true);
      toast.success("LinkedIn account connected successfully!");
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black">Connect Accounts</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Connect your GitHub and LinkedIn accounts to get personalized insights, project analysis, and better job recommendations.
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {/* GitHub Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg">
                <GithubIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Connect GitHub</h3>
            </div>
            <button 
              onClick={handleGithubConnect}
              disabled={githubConnected}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors shadow-lg ${
                githubConnected 
                  ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                  : "bg-violet-600 text-slate-900 dark:text-white hover:bg-violet-500 shadow-violet-500/20"
              }`}
            >
              {githubConnected ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <GithubIcon className="h-4 w-4 mr-2" />} 
              {githubConnected ? "Connected" : "Connect GitHub"}
            </button>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Analyze your repositories, contributions, and coding activity to showcase your technical skills.
          </p>
        </div>

        {/* LinkedIn Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A66C2] text-slate-900 dark:text-white shadow-lg shadow-blue-500/20">
                <LinkedinIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Connect LinkedIn</h3>
            </div>
            <button 
              onClick={handleLinkedinConnect}
              disabled={linkedinConnected}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors shadow-lg ${
                linkedinConnected 
                  ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                  : "bg-[#0A66C2] text-slate-900 dark:text-white hover:bg-[#004182] shadow-blue-500/20"
              }`}
            >
              {linkedinConnected ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <LinkedinIcon className="h-4 w-4 mr-2 text-slate-900 dark:text-white" />} 
              {linkedinConnected ? "Connected" : "Connect LinkedIn"}
            </button>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Import your profile, experience, and network to get better career insights and opportunities.
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 transition-colors hover:text-slate-900 dark:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500"
        >
          Save & Continue <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
