import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, CheckCircle, Circle } from "lucide-react";

import AuthLayout from "../components/layout/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
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
  let strengthColor = "text-[#ff94aa]";
  let barColor = "bg-[#ff94aa]";
  let filledBars = 0;

  if (password.length > 0) {
    if (strengthScore <= 2) {
      strengthLabel = "Weak";
      strengthColor = "text-[#ff94aa]";
      barColor = "bg-[#ff94aa]";
      filledBars = 1;
    } else if (strengthScore === 3 || strengthScore === 4) {
      strengthLabel = "Fair";
      strengthColor = "text-[#ffd159]";
      barColor = "bg-[#ffd159]";
      filledBars = Math.floor(strengthScore / 1.5); // 2 or 3
    } else if (strengthScore === 5) {
      strengthLabel = "Strong";
      strengthColor = "text-[#4ee4cb]";
      barColor = "bg-[#4ee4cb]";
      filledBars = 4;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (strengthScore <= 2) {
      toast.error("Please choose a stronger password");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const aboveCard = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="text-center"
    >
      <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#ffd159]/15 shadow-lg shadow-black/20">
        <Lock className="h-6 w-6 text-[#ffd159]" />
      </div>
      <h1 className="text-2xl font-black text-white md:text-3xl">
        Reset Your <span className="text-[#ffd159]">Password</span>
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Enter and confirm your new password below
      </p>
    </motion.div>
  );

  const belowCard = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="text-center mt-3"
    >
      <p className="text-sm text-slate-400">
        Remember your old password?{" "}
        <Link to="/login" className="font-semibold text-[#ffd159] hover:underline">
          Back to Login
        </Link>
      </p>
    </motion.div>
  );

  const checkItem = (text, checked) => (
    <div className="flex items-center gap-2 text-xs">
      {checked ? (
        <CheckCircle className="h-3.5 w-3.5 text-[#4ee4cb] shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
      )}
      <span className={checked ? "text-slate-200 font-medium" : "text-slate-400"}>{text}</span>
    </div>
  );

  return (
    <AuthLayout backLink={{ text: "Back to Login", href: "/login" }} aboveCard={aboveCard} belowCard={belowCard}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <PasswordInput
            label="New Password"
            name="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="mt-2.5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Password strength:</span>
              <span className={`font-bold ${password.length === 0 ? "text-slate-500" : strengthColor}`}>
                {password.length === 0 ? "None" : strengthLabel}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    index <= filledBars ? barColor : "bg-[#242730] border border-white/[0.06]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-3.5 rounded-2xl border border-white/[0.08] bg-[#242730]/70 p-3.5 grid grid-cols-2 gap-x-3 gap-y-2">
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full mt-6 mb-2 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] py-3 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </div>

      </form>
    </AuthLayout>
  );
}
