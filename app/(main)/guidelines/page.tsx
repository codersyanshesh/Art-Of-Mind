"use client";

import React from "react";
import { BookOpen, ShieldAlert, Sparkles, Copyright, EyeOff, Scale } from "lucide-react";

export default function GuidelinesPage() {
  const guidelines = [
    {
      title: "Content Safety & Moderation",
      desc: "All vertical series uploads, images, and visual novels are scanned automatically by our AI NSFW Detection systems. Submissions violating rating classifications will be rejected automatically.",
      icon: EyeOff,
      color: "text-rose-400"
    },
    {
      title: "Copyright & Plagiarism",
      desc: "Creators must own all materials published in their story universes. Our AI Plagiarism and Copyright Detector scans novels, scripts, and media files against global databases on submission.",
      icon: Copyright,
      color: "text-cyan-400"
    },
    {
      title: "Story Universe Rights",
      desc: "When collaborating inside an interconnected universe franchise, co-authors agree to mutual revenue distribution rates enforced dynamically through smart agreements in the Creator Studio.",
      icon: Scale,
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-electric-violet" />
          Community & Creator Guidelines
        </h1>
        <p className="text-xs text-slate-400">
          Review content guidelines, plagiarism policies, and automated AI moderation details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guidelines.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-white/10 transition-colors space-y-4">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 w-max ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Warnings & Strike System */}
      <div className="p-6 rounded-2xl glass-panel-neon border border-white/10 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-electric-violet" />
          Supervisory Strike & Appeal System
        </h2>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            1. **First Strike**: The offending episode, chapter, or comic page is archived privately, and a warning is issued via email with an appeal link.
          </p>
          <p>
            2. **Second Strike**: Monetization is temporarily suspended on the affected Story Universe for 14 days. Reviewers will audit the franchise.
          </p>
          <p>
            3. **Third Strike**: Creator account access is locked. Appeals are routed to Trust & Safety coordinators.
          </p>
        </div>
      </div>
    </div>
  );
}
