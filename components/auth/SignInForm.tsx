"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

import { createClient } from "@/lib/supabase/client";
import { signInAction } from "@/app/actions/auth";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Show oauth error message if redirected back with ?error=
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      if (oauthError === "locked_out") {
        const hours = searchParams.get("hours") || "48";
        setError(`This Google account is locked due to too many failed OTP attempts. Please wait ${hours} hours to try again.`);
      } else if (oauthError === "otp_send_failed") {
        setError("Failed to send verification code to your Gmail. Please try again.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    }
  }, [searchParams]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      // Step 1: Verify credentials with Supabase
      const result = await signInAction(formData);

      if (result.error) {
        setIsLoading(false);
        setError(result.error);
        return;
      }

      if (result.success && result.user) {
        setIsLoading(false);
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
      setError("An unexpected authentication error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Supabase will redirect here after Google grants permission
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsLoading(false);
    }
    // On success, the browser navigates away to Google's account picker automatically
  };


  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl glass-panel border border-white/5 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
        <p className="text-sm text-slate-400">Sign in to resume creating &amp; reading</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Google OAuth Button — redirects to real Google account picker */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-sm text-slate-200 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
        {isLoading ? "Redirecting to Google..." : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-[1px] flex-1 bg-white/5" />
        <span className="text-xs text-slate-500 font-medium">OR EMAIL</span>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. creative@aom.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input border border-white/10 focus:border-electric-violet"
              required
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs text-electric-violet hover:text-cyan-accent font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl glass-input border border-white/10 focus:border-electric-violet"
              required
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50 cursor-pointer"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-electric-violet to-cyan-accent rounded-xl animate-pulse-glow" />
          <span className="relative flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950/90 text-sm font-semibold text-white transition-all group-hover:bg-slate-900/50">
            {isLoading ? "Verifying..." : "Sign In with MFA"}
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </form>

      {/* Navigation to Sign Up */}
      <div className="text-center text-sm text-slate-400">
        New to Art of Mind?{" "}
        <Link href="/sign-up" className="text-electric-violet hover:text-cyan-accent font-semibold transition-colors">
          Create account
        </Link>
      </div>
    </div>
  );
}
