import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ConnectAccountsStep({ onNext, onPrev, onSave }) {
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const handleNext = () => {
    // Basic validation
    if (githubUrl && !githubUrl.includes("github.com")) {
      toast.error("Please enter a valid GitHub URL");
      return;
    }
    if (linkedinUrl && !linkedinUrl.includes("linkedin.com")) {
      toast.error("Please enter a valid LinkedIn URL");
      return;
    }
    
    if (onSave) {
      onSave({ githubUrl, linkedinUrl });
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-black">Connect Accounts</h1>
        <p className="text-base text-slate-500 dark:text-gray-400">
          Connect your GitHub and LinkedIn profiles. Our AI will analyze your actual repositories and public data to give you hyper-personalized career advice.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* GitHub Card */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">GitHub Profile URL (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="url"
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 py-4 pl-12 pr-4 text-base text-slate-900 dark:text-white outline-none transition-all focus:border-violet-500 focus:bg-slate-200 dark:bg-white/10 placeholder:text-slate-400"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            We will fetch your public repositories and languages to analyze your technical skills.
          </p>
        </div>

        {/* LinkedIn Card */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">LinkedIn Profile URL (Optional)</label>
          <div className="relative flex items-center">
            <div className="absolute left-4 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 py-4 pl-12 pr-4 text-base text-slate-900 dark:text-white outline-none transition-all focus:border-violet-500 focus:bg-slate-200 dark:bg-white/10 placeholder:text-slate-400"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            We will cross-reference your resume with your public LinkedIn presence.
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
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500"
        >
          Continue <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
