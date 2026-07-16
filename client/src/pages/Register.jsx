import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, ArrowRight } from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import FormInput from "../components/auth/FormInput";
import PasswordInput from "../components/auth/PasswordInput";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";

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

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      // TODO: swap for the real endpoint once the backend is live
      // await axios.post("/api/auth/register", form);
      await new Promise((resolve) => setTimeout(resolve, 900));

      toast.success("Account created successfully!");
      setTimeout(() => navigate("/onboarding"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout backLink={{ text: "Back to Login", href: "/login" }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-3 text-center"
      >
        <h1 className="mb-1 text-2xl font-black md:text-3xl">Create your account</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Join CareerPilot AI and start your journey towards career success.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <FormInput
          label="Full Name"
          icon={User}
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Email address"
          icon={Mail}
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Create a password"
          helperText="Must be at least 8 characters with a mix of letters, numbers & symbols"
          value={form.password}
          onChange={handleChange}
          required
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />



        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: "0px 0px 35px rgba(139,92,246,.55)" }}
          whileTap={{ scale: 0.98 }}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-semibold text-slate-900 dark:text-white transition-opacity disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
          {!loading && (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </motion.button>
      </form>

      <div className="my-3 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span className="text-xs text-slate-400 dark:text-gray-500">or sign up with</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <SocialAuthButtons />

      <p className="mt-3 text-center text-sm text-slate-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-violet-300 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
