"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import OTPInput from "./OTPInput";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate OTP generation
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleOTPSuccess = () => {
    // Go to step 3 (reset password)
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate password update
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl glass-panel border border-white/5 shadow-2xl space-y-6">
      {step === 1 && (
        <form onSubmit={handleRequestOTP} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">Recover Password</h2>
            <p className="text-sm text-slate-400">Enter your registered email to receive an MFA verification code</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. creative@aom.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input border border-white/10 focus:border-electric-violet"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-electric-violet to-cyan-accent rounded-xl" />
            <span className="relative flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950/90 text-sm font-semibold text-white transition-all group-hover:bg-slate-900/50">
              {isLoading ? "Sending..." : "Request Reset OTP"}
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <div className="text-center text-sm">
            <Link href="/sign-in" className="text-slate-400 hover:text-white transition-colors">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}

      {step === 2 && (
        <OTPInput
          email={email}
          onSuccess={handleOTPSuccess}
          reason="forgot"
        />
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">New Password</h2>
            <p className="text-sm text-slate-400">Set a strong credentials key for your account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input border border-white/10 focus:border-electric-violet"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input border border-white/10 focus:border-electric-violet"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-electric-violet to-cyan-accent rounded-xl" />
            <span className="relative flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950/90 text-sm font-semibold text-white transition-all group-hover:bg-slate-900/50">
              {isLoading ? "Saving..." : "Update Password"}
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Password Updated</h2>
            <p className="text-sm text-slate-400">Your credentials key has been reset successfully.</p>
          </div>

          <Link
            href="/sign-in"
            className="block w-full py-3 rounded-xl bg-electric-violet hover:bg-purple-700 text-sm font-semibold text-white transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      )}
    </div>
  );
}
