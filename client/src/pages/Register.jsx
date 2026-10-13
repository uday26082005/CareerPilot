import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, ArrowRight } from "lucide-react";
import axios from "axios";

import AuthLayout from "../components/layout/AuthLayout";
import FormInput from "../components/auth/FormInput";
import PasswordInput from "../components/auth/PasswordInput";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import { supabase } from "../lib/supabase";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const formElement = e.currentTarget || e.target;
    setLoading(true);
    try {
      // 1. Verify if the email is a real existing mailbox
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const validationRes = await axios.post(`${API_BASE_URL}/auth/validate-email`, { email: form.email });
      
      if (!validationRes.data.success) {
        throw new Error(validationRes.data.message || "Email address does not exist or is invalid.");
      }

      // 2. If valid, proceed with Supabase sign up
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        if (typeof window !== "undefined" && window.PasswordCredential && navigator.credentials?.store) {
          try {
            const cred = new window.PasswordCredential(formElement);
            navigator.credentials.store(cred).catch(() => {});
          } catch {
            try {
              const cred = new window.PasswordCredential({
                id: form.email,
                password: form.password,
                name: form.fullName || form.email,
              });
              navigator.credentials.store(cred).catch(() => {});
            } catch {
              // Ignored
            }
          }
        }
        toast.success("Account created successfully!");
        setTimeout(() => {
          window.location.href = "/onboarding";
        }, 400);
      } else {
        toast.success("Account created! Please check your email for a verification link.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      // Check if it's an axios error with a response from our backend
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong. Try again.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <AuthLayout backLink={{ text: "Back to Login", href: "/login" }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-4 text-center"
      >
        <h1 className="mb-1 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">Create your account</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Join CareerPilot AI and start your journey towards career success.
        </p>
      </motion.div>

      <form 
        onSubmit={handleSubmit} 
        method="POST" 
        action="/register" 
        autoComplete="on" 
        className="space-y-3"
      >
        <FormInput
          label="Full Name"
          icon={User}
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Email address"
          icon={Mail}
          id="registerEmail"
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
          id="registerPassword"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          helperText="Must be at least 8 characters with a mix of letters, numbers & symbols"
          value={form.password}
          onChange={handleChange}
          required
        />

        <PasswordInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <motion.button
          type="submit"
          aria-busy={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-3 group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95 ${
            loading ? "opacity-80 pointer-events-none cursor-wait" : ""
          }`}
        >
          {loading ? "Creating account..." : "Create Account"}
          {!loading && (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </motion.button>
      </form>

      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
        <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">or sign up with</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
      </div>

      <SocialAuthButtons />

      <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700 dark:text-[#ffd159] hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
