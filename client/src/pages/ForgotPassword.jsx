import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Send } from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import FormInput from "../components/auth/FormInput";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset link sent to your email!");
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const aboveCard = null;

  const belowCard = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="text-center mt-3"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Remember your password?{" "}
        <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700 dark:text-[#ffd159] hover:underline">
          Back to Login
        </Link>
      </p>
    </motion.div>
  );

  return (
    <AuthLayout aboveCard={aboveCard} belowCard={belowCard}>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200 dark:border-white/[0.08] bg-amber-50 dark:bg-[#ffd159]/15 shadow-sm dark:shadow-md dark:shadow-black/20">
          <Mail className="h-6 w-6 text-amber-600 dark:text-[#ffd159]" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Forgot Password?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Enter your email and we'll send you a reset link</p>
        </div>
      </div>

      <form 
        onSubmit={handleSubmit} 
        method="POST" 
        action="/forgot-password" 
        autoComplete="on" 
        className="space-y-4"
      >
        <FormInput
          label="Registered Email Address"
          icon={Mail}
          id="forgotEmail"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
