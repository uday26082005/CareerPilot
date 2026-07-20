import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import GoogleIcon from "./GoogleIcon";
import GithubIcon from "./GithubIcon";
import LinkedinIcon from "./LinkedinIcon";

const buttons = [
  { label: "Continue with Google", icon: <GoogleIcon />, provider: "google" },
  { label: "Continue with GitHub", icon: <GithubIcon className="h-5 w-5 text-slate-900 dark:text-white" />, provider: "github" },
  { label: "Continue with LinkedIn", icon: <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" />, provider: "linkedin_oidc" },
];

export default function SocialAuthButtons() {
  const handleOAuth = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {buttons.map((b) => (
        <motion.button
          key={b.label}
          type="button"
          aria-label={b.label}
          onClick={() => handleOAuth(b.provider)}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 backdrop-blur-xl transition-colors hover:border-violet-500/40 hover:bg-slate-200 dark:hover:bg-white/10"
        >
          {b.icon}
        </motion.button>
      ))}
    </div>
  );
}
