"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Sparkles, BookOpen, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import confetti from "canvas-confetti";
import { signUpAction, signInAction } from "@/app/actions/auth";

export default function SignUpForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Member" | "Creator">("Member");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", username);
      formData.append("role", role === "Creator" ? "CREATOR" : "READER");

      const result = await signUpAction(formData);

      if (result.error) {
        setIsLoading(false);
        setError(result.error);
        return;
      }

      if (result.success) {
        // Automatically sign in the user to establish Supabase session cookies
        const signInFormData = new FormData();
        signInFormData.append("email", email);
        signInFormData.append("password", password);
        
        const loginResult = await signInAction(signInFormData);
        setIsLoading(false);

        if (loginResult.error) {
          setError(`Account created, but sign-in failed: ${loginResult.error}. Please try signing in manually.`);
          setTimeout(() => router.push("/sign-in"), 3000);
          return;
        }

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#7c3aed", "#06b6d4", "#fbbf24"],
        });
        
        setTimeout(() => {
          router.push("/home");
        }, 800);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError("An unexpected registration error occurred.");
    }
  };


  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl glass-panel border border-white/5 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">Join Art of Mind</h2>
        <p className="text-sm text-slate-400">Discover & publish interconnected multi-format stories</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Role Selection Slider */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Account Role</label>
        <div className="grid grid-cols-2 p-1 gap-1 bg-slate-950/80 rounded-xl border border-white/5 relative z-10">
          <button
            type="button"
            onClick={() => setRole("Member")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer",
              role === "Member"
                ? "bg-electric-violet text-white shadow-lg text-glow-violet"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Member
          </button>
          <button
            type="button"
            onClick={() => setRole("Creator")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer",
              role === "Creator"
                ? "bg-electric-violet text-white shadow-lg text-glow-violet"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Creator
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 pl-1">
          {role === "Creator"
            ? "Publish novels, vertical series, comics, audio, and earn tips/donations."
            : "Watch vertical series, read novels, support creators, and join communities."}
        </p>
      </div>

      {/* Form Credentials */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. mindbender"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input border border-white/10 focus:border-electric-violet"
              required
            />
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. story@aom.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input border border-white/10 focus:border-electric-violet"
              required
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
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

        {/* Terms Agreement */}
        <label className="flex items-start gap-2.5 cursor-pointer py-1 select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 accent-electric-violet rounded border-slate-700 bg-slate-900"
          />
          <span className="text-xs text-slate-400 hover:text-slate-300">
            I agree to the <span className="text-electric-violet hover:underline">Terms of Service</span> and{" "}
            <span className="text-electric-violet hover:underline">Privacy Policy</span>.
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50 cursor-pointer"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-electric-violet to-cyan-accent rounded-xl" />
          <span className="relative flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950/90 text-sm font-semibold text-white transition-all group-hover:bg-slate-900/50">
            {isLoading ? "Preparing secure key..." : "Register Account"}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </form>

      {/* Navigation to Sign In */}
      <div className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-electric-violet hover:text-cyan-accent font-semibold transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
