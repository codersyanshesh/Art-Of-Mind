"use client";

import React from "react";
import { ShieldCheck, Eye, Lock, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
          Privacy Policy & Terms
        </h1>
        <p className="text-xs text-slate-400">
          Last updated: July 2, 2026. How we protect your authentication and creative works.
        </p>
      </div>

      <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Lock className="w-4.5 h-4.5 text-electric-violet" />
            1. Authentication & Security
          </h2>
          <p>
            For the security of creators, we implement Multi-Factor Authentication with OTP tokens. Password hashes are stored using cryptographically secure hashing functions. Google authentication OAuth metadata is processed strictly for authentication checks and is never shared.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Eye className="w-4.5 h-4.5 text-cyan-accent" />
            2. Intellectual Property & Story Universes
          </h2>
          <p>
            Creators retain 100% intellectual property ownership of original written works, vertical series, and illustrations. Collaboration agreements signed inside the Creator Studio form legally binding smart rules for revenue splits inside AOM.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <FileText className="w-4.5 h-4.5 text-gold-accent" />
            3. Data Deletion & Account Closure
          </h2>
          <p>
            Users can request complete data purge and account closures at any time via Settings. All active drafts, novels, and creator analytics files will be permanently purged within 30 days.
          </p>
        </div>
      </div>
    </div>
  );
}
