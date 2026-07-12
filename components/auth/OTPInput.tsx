"use client";

import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, RefreshCw, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface OTPInputProps {
  email: string;
  onSuccess: () => void;
  reason?: "signin" | "signup" | "forgot";
}

export default function OTPInput({ email, onSuccess, reason = "signin" }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Focus first input initially
    inputRefs.current[0]?.focus();

    // Countdown timer for resend button
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto-focus next input if current one is filled
    if (val && index < 5) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setActiveInput(5);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    setIsResending(false);

    if (resendError) {
      setError(resendError.message);
    } else {
      setTimer(59);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Verify the OTP against Supabase Auth
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError) {
      setIsVerifying(false);
      setError(verifyError.message || "Invalid or expired code. Please try again.");
      return;
    }

    // OTP verified — show success state then hand off
    setSuccess(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#7c3aed", "#06b6d4", "#fbbf24"],
    });

    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl glass-panel-neon border border-white/10 text-center relative overflow-hidden">
      {success ? (
        <div className="space-y-4 py-8 animate-pulse-glow">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">Verification Complete</h2>
          <p className="text-sm text-slate-400">Setting up your secure session...</p>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="w-12 h-12 rounded-xl bg-electric-violet/20 border border-electric-violet/30 flex items-center justify-center mx-auto text-electric-violet">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">Enter MFA Code</h2>
            <p className="text-sm text-slate-400">
              We sent a 6-digit verification code to
              <span className="block font-medium text-slate-200">{email}</span>
            </p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 sm:gap-3 py-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  if (el) inputRefs.current[idx] = el;
                }}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl glass-input border border-white/10 focus:border-electric-violet focus:ring-1 focus:ring-electric-violet"
                required
              />
            ))}
          </div>

          {error && <p className="text-xs font-medium text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-electric-violet to-cyan-accent rounded-xl" />
            <span className="relative block py-3 rounded-xl bg-slate-950/90 text-sm font-semibold text-white transition-all group-hover:bg-slate-900/50">
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </span>
          </button>

          {/* Resend Timer */}
          <div className="flex items-center justify-center gap-2 text-sm">
            {timer > 0 ? (
              <span className="text-slate-500">Resend code in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center gap-1 text-electric-violet hover:text-cyan-accent font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
