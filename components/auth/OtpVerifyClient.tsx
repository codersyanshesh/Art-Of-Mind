"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { verifyGoogleOtpAction, resendGoogleOtpAction } from "@/app/actions/auth";

interface OtpVerifyClientProps {
  initialEmail: string;
}

export default function OtpVerifyClient({ initialEmail }: OtpVerifyClientProps) {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isLocked, setIsLocked] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Mask email for display: lh***@gmail.com
  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    if (name.length <= 2) return `**@${domain}`;
    return `${name.slice(0, 2)}***@${domain}`;
  };

  // Resend code cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus the first input on load
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    // Only accept numeric inputs
    if (val && !/^[0-9]$/.test(val)) return;

    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    // Auto-advance to next input
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Backspace on empty input -> focus previous
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setCode(digits);
    inputsRef.current[5]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await verifyGoogleOtpAction(initialEmail, fullCode);
      if (res.error) {
        setError(res.error);
        if (res.locked) {
          setIsLocked(true);
        }
        // Clear inputs on failure to allow retry
        setCode(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      } else {
        // Success — redirect to home
        router.push("/home");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);

    try {
      const res = await resendGoogleOtpAction(initialEmail);
      if (res.error) {
        setError(res.error);
      } else {
        setResendCooldown(60);
        setError("A new verification code has been sent to your Gmail.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code.");
    }
  };

  if (isLocked) {
    return (
      <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 text-center animate-fade-in shadow-2xl relative z-10">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
          <Clock className="w-7 h-7 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Security Lockout Active</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You entered incorrect verification codes too many times. To protect your account, this Google sign-in has been temporarily locked for 48 hours. Please check back later.
          </p>
        </div>
        <button
          onClick={() => router.push("/sign-in")}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors border border-white/5 cursor-pointer"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 animate-fade-in shadow-2xl relative z-10">
      {/* Icon & Heading */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-electric-violet/10 border border-electric-violet/20 flex items-center justify-center text-electric-violet mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-white">Enter Verification Code</h2>
          <p className="text-xs text-slate-400 leading-relaxed flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-accent" />
            We sent a 6-digit OTP code to {maskEmail(initialEmail)}
          </p>
        </div>
      </div>

      {/* Code Input Form */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-between gap-2.5">
          {code.map((num, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              value={num}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-lg font-black bg-slate-950 border border-white/10 rounded-xl focus:outline-none focus:border-electric-violet focus:ring-1 focus:ring-electric-violet text-white transition-all"
              disabled={loading}
              required
            />
          ))}
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 shadow-lg shadow-electric-violet/20"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Verify Code
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend Cooldown */}
      <div className="text-center pt-2 border-t border-white/5">
        {resendCooldown > 0 ? (
          <p className="text-[11px] text-slate-500">
            Resend verification code in <span className="font-bold text-slate-400">{resendCooldown}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-[11px] font-bold text-electric-violet hover:text-purple-400 transition-colors cursor-pointer"
          >
            Resend OTP Code
          </button>
        )}
      </div>
    </div>
  );
}
