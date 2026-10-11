import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import GoogleIcon from "./GoogleIcon";
import GithubIcon from "./GithubIcon";

const buttons = [
  { label: "Continue with Google", icon: <GoogleIcon />, provider: "google" },
  { label: "Continue with GitHub", icon: <GithubIcon className="h-5 w-5 text-slate-900 dark:text-white" />, provider: "github" },
];

export default function SocialAuthButtons() {
  const handleOAuth = async (provider) => {
    const providerLabel = provider.replace('_oidc', '').toUpperCase();
    toast.loading(`Redirecting to ${providerLabel}...`, { id: "oauth-loading" });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || `Failed to sign in with ${providerLabel}`, { id: "oauth-loading" });
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
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#242730] backdrop-blur-xl shadow-md shadow-black/20 transition-all hover:border-white/20 hover:bg-slate-200 dark:hover:bg-[#2b2f3a]"
        >
          {b.icon}
        </motion.button>
      ))}
    </div>
  );
}
