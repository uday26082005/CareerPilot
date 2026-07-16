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

  const aboveCard = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="text-center"
    >
      <h1 className="mb-1 text-2xl font-black md:text-3xl">
        Forgot <span className="text-violet-400">Password?</span>
      </h1>
      <p className="mx-auto max-w-sm text-sm text-gray-400">
        No worries! Enter your registered email address and we'll send you a link to reset your password.
      </p>
      
      {/* Illustration */}
      <div className="mt-4 mb-2 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-violet-600/30 blur-[40px]" />
          <div className="relative flex h-20 w-28 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-violet-400 to-violet-600 shadow-xl shadow-violet-500/20">
            <Mail className="absolute h-10 w-10 text-white/90" strokeWidth={1} />
            <div className="relative z-10 mt-4 rounded-lg bg-white p-1.5 shadow-lg">
              <Lock className="h-4 w-4 text-violet-600" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const belowCard = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="space-y-4 text-center"
    >
      <p className="text-sm text-gray-400">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-violet-400 hover:underline">
          Back to Login
        </Link>
      </p>
      
      <div>
        <div className="mb-1 flex items-center justify-center gap-2 text-sm font-medium text-white">
          <ShieldCheck className="h-4 w-4" /> Your data is safe with us.
        </div>
        <p className="text-xs text-gray-500">
          We never share your information with anyone.
        </p>
      </div>
    </motion.div>
  );

  return (
    <AuthLayout backLink={{ text: "Back to Login", href: "/login" }} aboveCard={aboveCard} belowCard={belowCard}>
      <div className="mb-4 flex items-center gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <Mail className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Enter your email</h3>
          <p className="text-sm text-gray-400">We'll send you a reset link to your email</p>
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
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-semibold text-white transition-opacity disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>
      </form>

      <div className="my-3 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-gray-500 uppercase">OR</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-white transition-colors hover:bg-white/10"
      >
        <GoogleIcon />
        Use another account
      </motion.button>
    </AuthLayout>
  );
}
