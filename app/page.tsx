"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticleField from "@/components/3d/ParticleField";
import HeroScene from "@/components/3d/HeroScene";
import GlobeScene from "@/components/3d/GlobeScene";
import FloatingCards3D from "@/components/3d/FloatingCards3D";
import { 
  Sparkles, ArrowRight, Play, BookOpen, MessageSquare, 
  Share2, Shield, Heart, Zap, Globe, DollarSign 
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-cosmic-bg text-slate-100 selection:bg-electric-violet selection:text-white">
      {/* 3D Stars background */}
      <ParticleField />

      {/* Navigation */}
      <Navbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-electric-violet/10 border border-electric-violet/20 hover:border-electric-violet/40 transition-colors cursor-pointer group">
                <Sparkles className="w-4 h-4 text-electric-violet group-hover:text-cyan-accent transition-colors" />
                <span className="text-xs font-semibold text-slate-300">
                  A New Era of Creative Narratives
                </span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Where Stories Live in{" "}
                <span className="bg-gradient-to-r from-electric-violet via-cyan-accent to-gold-accent bg-clip-text text-transparent">
                  Every Format
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
                Art of Mind is the first unified creative entertainment ecosystem. Publish novels, stream short vertical dramas, launch interactive games, podcasts, and comics, all interconnected under one epic franchise.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/home"
                  className="px-8 py-3.5 rounded-full bg-electric-violet hover:bg-purple-700 text-sm font-semibold shadow-lg shadow-electric-violet/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Explore Stories
                </Link>
                <Link
                  href="/sign-up"
                  className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Become a Creator
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Scene */}
            <div className="lg:col-span-5 relative">
              <HeroScene />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Integration Section */}
      <section className="relative py-20 border-t border-white/5 bg-slate-950/40 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              One Concept. Infinite Possibilities.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              AOM bridges traditional narrative formats with modern discovery, combining the best elements of global creators hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass-panel space-y-4 hover:border-electric-violet/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-electric-violet/10 border border-electric-violet/20 flex items-center justify-center text-electric-violet">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Wattpad + Loklok</h3>
              <p className="text-sm text-slate-400">
                Read novels while seamlessly watching matching short vertical drama adaptions, side-by-side.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-4 hover:border-cyan-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center text-cyan-accent">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">TikTok + YouTube</h3>
              <p className="text-sm text-slate-400">
                Discover content through short vertical reels, clips, and trailers with high-accuracy suggestions.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-4 hover:border-gold-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Patreon + Discord</h3>
              <p className="text-sm text-slate-400">
                Unlock exclusive stories and merchandise, join fan clubs, and chat in creator communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Card Stack Genre Showcase */}
      <section className="relative py-20 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Interactive Formats
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Move your mouse over the cards below to experience 3D tilt effects, customized with aura neon glow.
            </p>
          </div>

          <FloatingCards3D />
        </div>
      </section>

      {/* Global Network Section with GlobeScene */}
      <section className="relative py-20 border-t border-white/5 bg-slate-950/20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Globe Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-electric-violet/10 border border-electric-violet/20 flex items-center justify-center text-electric-violet">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Global Creator Collaboration
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Creators, illustrators, editors, and voice actors are connecting on AOM from all over the world. Work together on shared story universes, divide revenue dynamically, and co-author masterpieces.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-electric-violet/20 flex items-center justify-center text-electric-violet text-xs font-bold">✓</div>
                  <span className="text-sm font-medium text-slate-300">Invite guest voice actors & translators</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-electric-violet/20 flex items-center justify-center text-electric-violet text-xs font-bold">✓</div>
                  <span className="text-sm font-medium text-slate-300">Interactive maps and franchise wikis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-electric-violet/20 flex items-center justify-center text-electric-violet text-xs font-bold">✓</div>
                  <span className="text-sm font-medium text-slate-300">Shared smart contracts for revenue distribution</span>
                </div>
              </div>
            </div>

            {/* Globe 3D Canvas */}
            <div className="lg:col-span-6">
              <GlobeScene />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-electric-violet/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Build Your <span className="text-electric-violet text-glow-violet">Story Universe</span>?
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Whether you are a reader, viewer, writer, or artist, your place in the Art of Mind ecosystem is waiting.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/sign-up"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-electric-violet to-cyan-accent text-sm font-bold text-white shadow-xl shadow-electric-violet/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
