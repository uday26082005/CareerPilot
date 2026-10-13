import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ArrowRight } from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import FormInput from "../components/auth/FormInput";
import PasswordInput from "../components/auth/PasswordInput";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("careerpilot_remember_email");
    if (savedEmail) {
      setForm((f) => ({ ...f, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const formElement = e.currentTarget || e.target;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem("careerpilot_remember_email", form.email);
      } else {
        localStorage.removeItem("careerpilot_remember_email");
      }

      // Prompt Google Password Manager via Credential Management API
      if (typeof window !== "undefined" && window.PasswordCredential && navigator.credentials?.store) {
        try {
          const cred = new window.PasswordCredential(formElement);
          navigator.credentials.store(cred).catch(() => {});
        } catch {
          try {
            const cred = new window.PasswordCredential({
              id: form.email,
              password: form.password,
              name: form.email,
            });
            navigator.credentials.store(cred).catch(() => {});
          } catch {
            // Ignored if unsupported or user dismisses
          }
        }
      }

      toast.success("Successfully logged in!");
      
      // Real browser navigation ensures Chrome's Password Manager completes the form lifecycle
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } catch (err) {
      toast.error(err.message || "Invalid credentials. Try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout backLink={{ text: "Back to Home", href: "/" }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-5 text-center"
      >
        <h1 className="mb-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">Welcome back</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Log in to continue your journey
        </p>
      </motion.div>

      <form 
        onSubmit={handleSubmit} 
        method="POST" 
        action="/dashboard" 
        autoComplete="on" 
        className="space-y-4"
      >
        <FormInput
          label="Email address"
          icon={Mail}
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <PasswordInput
          label="Password"
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-[#242730] accent-amber-500 dark:accent-[#ffd159] cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 dark:text-[#ffd159] hover:underline transition-colors font-medium">
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          aria-busy={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-4 group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95 ${
            loading ? "opacity-80 pointer-events-none cursor-wait" : ""
          }`}
        >
          {loading ? "Logging in..." : "Log In"}
          {!loading && (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </motion.button>
      </form>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
        <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">or continue with</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
      </div>

      <SocialAuthButtons />

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-amber-600 hover:text-amber-700 dark:text-[#ffd159] hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
