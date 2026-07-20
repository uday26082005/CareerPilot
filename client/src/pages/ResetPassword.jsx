import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, ShieldCheck, CheckCircle, Circle } from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic Password Validation
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore = Object.values(checks).filter(Boolean).length;

  let strengthLabel = "Weak";
  let strengthColor = "text-red-400";
  let barColor = "bg-red-500";
  let filledBars = 0;

  if (password.length > 0) {
    if (strengthScore <= 2) {
      strengthLabel = "Weak";
      strengthColor = "text-red-400";
      barColor = "bg-red-500";
      filledBars = 1;
    } else if (strengthScore === 3 || strengthScore === 4) {
      strengthLabel = "Fair";
      strengthColor = "text-yellow-400";
      barColor = "bg-yellow-500";
      filledBars = Math.floor(strengthScore / 1.5); // 2 or 3
    } else if (strengthScore === 5) {
      strengthLabel = "Strong";
      strengthColor = "text-emerald-400";
      barColor = "bg-emerald-500";
      filledBars = 4;
    }
  }

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
      <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/20 bg-violet-600/10 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
        <Lock className="h-5 w-5 text-violet-400" />
      </div>
      <h1 className="text-2xl font-black md:text-3xl">
        Reset Your <span className="text-violet-400">Password</span>
      </h1>
    </motion.div>
  );

  const belowCard = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="text-center mt-2"
    >
      <p className="text-sm text-slate-500 dark:text-gray-400">
        Remember your old password?{" "}
        <Link to="/login" className="font-medium text-violet-400 hover:underline">
          Back to Login
        </Link>
      </p>
    </motion.div>
  );

  const checkItem = (text, checked) => (
    <div className="flex items-center gap-2 text-xs">
      {checked ? (
        <CheckCircle className="h-4 w-4 text-emerald-400" />
      ) : (
        <Circle className="h-4 w-4 text-slate-900 dark:text-white/20" />
      )}
      <span className={checked ? "text-slate-600 dark:text-gray-300" : "text-slate-400 dark:text-gray-500"}>{text}</span>
    </div>
  );

  return (
    <AuthLayout backLink={{ text: "Back to Login", href: "/login" }} aboveCard={aboveCard} belowCard={belowCard}>
      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div>
          <PasswordInput
            label="New Password"
            name="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="mt-2">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-gray-400">Password strength:</span>
              <span className={`font-medium ${password.length === 0 ? "text-slate-400 dark:text-gray-500" : strengthColor}`}>
                {password.length === 0 ? "None" : strengthLabel}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    index <= filledBars ? barColor : "bg-slate-200 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 transition-colors">
            {checkItem("At least 8 characters", checks.length)}
            {checkItem("One uppercase letter", checks.uppercase)}
            {checkItem("One lowercase letter", checks.lowercase)}
            {checkItem("One number", checks.number)}
            {checkItem("One special character", checks.special)}
          </div>
        </div>

        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 35px rgba(139,92,246,.55)" }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full mt-6 mb-2 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-semibold text-slate-900 dark:text-white transition-opacity disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </div>

      </form>
    </AuthLayout>
  );
}
