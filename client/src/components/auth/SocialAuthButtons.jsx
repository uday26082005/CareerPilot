import { motion } from "framer-motion";
import GoogleIcon from "./GoogleIcon";
import GithubIcon from "./GithubIcon";
import LinkedinIcon from "./LinkedinIcon";

const buttons = [
  { label: "Continue with Google", icon: <GoogleIcon /> },
  { label: "Continue with GitHub", icon: <GithubIcon className="h-5 w-5 text-white" /> },
  { label: "Continue with LinkedIn", icon: <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" /> },
];

export default function SocialAuthButtons() {
  return (
    <div className="flex items-center justify-center gap-4">
      {buttons.map((b) => (
        <motion.button
          key={b.label}
          type="button"
          aria-label={b.label}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-colors hover:border-violet-500/40 hover:bg-white/10"
        >
          {b.icon}
        </motion.button>
      ))}
    </div>
  );
}
