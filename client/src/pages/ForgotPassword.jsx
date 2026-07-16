import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, Send, ShieldCheck } from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import FormInput from "../components/auth/FormInput";
import GoogleIcon from "../components/auth/GoogleIcon";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => setLoading(false), 1000);
  };

  const aboveCard = null;

  const belowCard = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="text-center mt-2"
    >
      <p className="text-sm text-slate-500 dark:text-gray-400">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-violet-400 hover:underline">
          Back to Login
        </Link>
      </p>
    </motion.div>
  );

  return (
    <AuthLayout aboveCard={aboveCard} belowCard={belowCard}>
      <div className="mb-4 flex items-center gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-3">
          <Mail className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Enter your email</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">We'll send you a reset link to your email</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: "0px 0px 35px rgba(139,92,246,.55)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-semibold text-slate-900 dark:text-white transition-opacity disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
