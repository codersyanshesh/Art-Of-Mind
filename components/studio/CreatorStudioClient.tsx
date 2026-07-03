"use client";

import React, { useState } from "react";
import {
  BarChart3, Video, Wand2, Users, FileText, Sparkles,
  TrendingUp, DollarSign, Eye, Clock, ThumbsUp, Calendar,
  Upload, Plus, Play, Brain, Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

type StudioTab = "dashboard" | "manager" | "ai_tools";

interface CreatorItem {
  id: string;
  title: string;
  type: string;
  coverImage: string;
  views: string;
  likes: string;
  status: "PUBLISHED" | "DRAFT";
}

interface DashboardStats {
  publishedCount: number;
  draftCount: number;
  chapterCount: number;
  characterCount: number;
  mediaCount: number;
  views: string;
  viewsChange: string;
  followers: string;
  followersChange: string;
  watchTime: string;
  watchTimeChange: string;
  revenue: string;
  revenueChange: string;
}

interface CreatorStudioClientProps {
  dashboardStats: DashboardStats;
  initialItems: CreatorItem[];
}

// Static demographic constants — no schema equivalent yet
const DEMOGRAPHICS = {
  countries: [
    { name: "United States", percentage: 38 },
    { name: "United Kingdom", percentage: 22 },
    { name: "Philippines", percentage: 14 },
    { name: "Canada", percentage: 12 },
    { name: "Australia", percentage: 9 },
    { name: "Other", percentage: 5 },
  ],
  ageGroups: [
    { range: "18–24", percentage: 42 },
    { range: "25–34", percentage: 33 },
    { range: "35–44", percentage: 16 },
    { range: "45+", percentage: 9 },
  ],
};

export default function CreatorStudioClient({ dashboardStats: stats, initialItems }: CreatorStudioClientProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>("dashboard");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiTool, setAiTool] = useState<string>("");
  const [aiPrompt, setAiPrompt] = useState("");

  const [creatorItems, setCreatorItems] = useState<CreatorItem[]>(
    initialItems.length > 0
      ? initialItems
      : [
          { id: "item_1", title: "The Crimson Throne (Novel)", type: "Novel", coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100", views: "452K", likes: "89K", status: "PUBLISHED" },
          { id: "item_2", title: "Shadows of the Crimson Crown", type: "Vertical Series", coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100", views: "1.2M", likes: "310K", status: "PUBLISHED" },
          { id: "item_3", title: "Citadel Meltdown: Interactive Ending", type: "Interactive", coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100", views: "-", likes: "-", status: "DRAFT" },
        ]
  );

  const handleAiAction = (toolName: string) => {
    if (!aiPrompt.trim()) {
      alert("Please enter a creative synopsis or character prompt in the input box first.");
      return;
    }
    setAiTool(toolName);
    setAiLoading(true);
    setAiResult(null);

    setTimeout(() => {
      setAiLoading(false);
      const text = aiPrompt.toLowerCase();
      if (toolName === "Script Helper") {
        let speakerA = "ELARA";
        let speakerB = "COMMANDER VALEN";
        if (text.includes("lydia")) speakerA = "LYDIA THE WITCH";
        if (text.includes("chancellor")) speakerB = "THE CHANCELLOR";
        setAiResult(
          `Scene 4: The Destiny Crossroads\n\n${speakerA} (gazing at the lava channels)\n"I will walk this path, but only on my own terms. My blood belongs to the dragons, not the Citadel."\n\n${speakerB} (stepping out of the dark)\n"A noble vow. But dragon flame alone cannot withstand the iron knights. You will need a shield."\n\n[AI Prompt Action: "${aiPrompt.trim()}"]`
        );
      } else if (toolName === "Voice Over") {
        setAiResult(`Synthesized Voice Track ID: voice_${text.includes("valen") ? "valen" : "elara"}_cloned_99.wav [0:14s]\nWaveform depth: Binaural 3D Surround Spatial\nClick "Preview Track" to test.`);
      } else if (toolName === "Caption Translator") {
        setAiResult(`[TRANSLATED DIALOGUE]\nSpanish: Escena 4 - La encrucijada del destino.\nJapanese: シーン4 - 宿命の交差点。\nPrompt query: "${aiPrompt.trim()}"`);
      } else {
        setAiResult(`Generated Graphic Asset: cover_variant_gemini.png\nTheme color: HSL Violet Neon Glow\nCover layout designed for "${aiPrompt.trim()}"`);
      }
    }, 1200);
  };

  const handleSaveDraft = () => {
    if (!aiResult) return;
    const newDraft: CreatorItem = {
      id: `item_${Date.now()}`,
      title: aiPrompt.length > 30 ? `${aiPrompt.slice(0, 30)}...` : aiPrompt,
      type: aiTool === "Script Helper" ? "Novel" : "Interactive",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
      views: "-",
      likes: "-",
      status: "DRAFT",
    };
    setCreatorItems((prev) => [newDraft, ...prev]);
    confetti({ particleCount: 80, spread: 60, colors: ["#7c3aed", "#10b981"] });
    alert("Saved AI generation as a story draft in your Story Manager!");
    setAiResult(null);
    setAiPrompt("");
  };

  const handlePublishDraft = (itemId: string) => {
    setCreatorItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: "PUBLISHED" } : item))
    );
    confetti({ particleCount: 120, spread: 70, colors: ["#06b6d4", "#fbbf24"] });
    alert("Draft successfully published to your Story Franchise feed!");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-electric-violet" />
            Creator Studio
          </h1>
          <p className="text-xs text-slate-400">
            Publish works, review analytical demographics, and use AI creator aids.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Upload Video
          </button>
          <button className="px-4 py-2 text-xs font-bold rounded-xl bg-electric-violet hover:bg-purple-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-electric-violet/20">
            <Plus className="w-3.5 h-3.5" />
            New Novel/Comic
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 border-b border-white/5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn(
            "px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2",
            activeTab === "dashboard" ? "border-electric-violet text-white" : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard &amp; Analytics
        </button>
        <button
          onClick={() => setActiveTab("manager")}
          className={cn(
            "px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2",
            activeTab === "manager" ? "border-electric-violet text-white" : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <FileText className="w-4 h-4" />
          Story Manager
        </button>
        <button
          onClick={() => setActiveTab("ai_tools")}
          className={cn(
            "px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2",
            activeTab === "ai_tools" ? "border-electric-violet text-white" : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <Wand2 className="w-4 h-4" />
          AI Creator Tools
        </button>
      </div>

      {/* Panels */}
      <div>
        {/* Tab 1: Dashboard Panel */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards — derived from real DB aggregates */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-medium uppercase tracking-wider">Total Views</span>
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold text-white">{stats.views}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{stats.viewsChange} this month</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-medium uppercase tracking-wider">Followers</span>
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold text-white">{stats.followers}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{stats.followersChange} this month</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-medium uppercase tracking-wider">Watch Time</span>
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold text-white">{stats.watchTime}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{stats.watchTimeChange} this month</span>
              </div>

              <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="text-xs font-medium uppercase tracking-wider">Revenue</span>
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-2xl font-bold text-white">{stats.revenue}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">{stats.revenueChange} this month</span>
              </div>
            </div>

            {/* Views Growth Chart + Format Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Views Growth</h3>
                    <p className="text-[10px] text-slate-500">Real-time engagement analysis</p>
                  </div>
                  <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-white/5">
                    {["Hourly", "Weekly"].map((t) => (
                      <button
                        key={t}
                        onClick={() => alert(`Period changed to ${t}`)}
                        className={cn(
                          "px-2.5 py-1 text-[9px] font-bold rounded-md transition-colors cursor-pointer",
                          t === "Hourly" ? "bg-electric-violet text-white" : "text-slate-400 hover:text-slate-200"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 w-full relative pt-4">
                  <svg viewBox="0 0 800 150" className="w-full h-full text-electric-violet animate-pulse-glow" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradient-views" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(124, 58, 237, 0.35)" />
                        <stop offset="100%" stopColor="rgba(124, 58, 237, 0.0)" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="30" x2="800" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="75" x2="800" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <path d="M 0 150 L 0 120 Q 100 130 200 95 T 400 35 T 600 75 T 800 15 L 800 150 Z" fill="url(#gradient-views)" />
                    <path d="M 0 120 Q 100 130 200 95 T 400 35 T 600 75 T 800 15" fill="none" stroke="#7c3aed" strokeWidth="3.5" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5 px-2 font-semibold">
                  <span>12 AM</span>
                  <span>4 AM</span>
                  <span>8 AM</span>
                  <span>12 PM</span>
                  <span>4 PM</span>
                  <span>8 PM</span>
                </div>
              </div>

              {/* Format Distribution Donut */}
              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Format Distribution</h3>
                  <p className="text-[10px] text-slate-500">Views split by media type</p>
                </div>

                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3.2" strokeDasharray="55 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7c3aed" strokeWidth="3.2" strokeDasharray="30 100" strokeDashoffset="-55" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fbbf24" strokeWidth="3.2" strokeDasharray="15 100" strokeDashoffset="-85" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Top</span>
                    <span className="text-sm font-black text-white">Reels</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[9px] text-center pt-2 border-t border-white/5 font-bold">
                  <div>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-accent mr-1" />
                    <span className="text-slate-400">Reels 55%</span>
                  </div>
                  <div>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-electric-violet mr-1" />
                    <span className="text-slate-400">Novels 30%</span>
                  </div>
                  <div>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-accent mr-1" />
                    <span className="text-slate-400">Audio 15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demographics Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Countries</h3>
                <div className="space-y-3">
                  {DEMOGRAPHICS.countries.map((country, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>{country.name}</span>
                        <span>{country.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div style={{ width: `${country.percentage}%` }} className="h-full bg-electric-violet rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Age Groups</h3>
                <div className="space-y-3">
                  {DEMOGRAPHICS.ageGroups.map((age, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>{age.range}</span>
                        <span>{age.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div style={{ width: `${age.percentage}%` }} className="h-full bg-cyan-accent rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Story Manager Panel */}
        {activeTab === "manager" && (
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Your Series &amp; Content</h3>
              <span className="text-xs text-slate-500">
                {creatorItems.filter((item) => item.status === "PUBLISHED").length} Published •{" "}
                {creatorItems.filter((item) => item.status === "DRAFT").length} Drafts
              </span>
            </div>

            <div className="space-y-4">
              {creatorItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded bg-slate-800 shrink-0 overflow-hidden">
                      <img src={item.coverImage} alt="cover" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className={cn(
                        "inline-block px-1.5 py-0.5 mt-1 text-[9px] font-bold rounded",
                        item.status === "PUBLISHED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    {item.status === "PUBLISHED" ? (
                      <>
                        <span>Views: {item.views}</span>
                        <span>Likes: {item.likes}</span>
                      </>
                    ) : (
                      <button
                        onClick={() => handlePublishDraft(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Publish Draft
                      </button>
                    )}
                    <button className="text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-white/5">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AI Creator Tools Panel */}
        {activeTab === "ai_tools" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-electric-violet" />
                  1. Input Creative Synopsis
                </h3>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Type a scenario summary (e.g. 'Lydia brews magic poison inside Whispering Woods for Valen')..."
                  className="w-full min-h-[100px] p-4 text-xs rounded-xl glass-input border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-electric-violet"
                />
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-electric-violet" />
                  2. Select AI Assistant Tool
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => handleAiAction("Script Helper")} className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-electric-violet/30 text-left space-y-2 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Brain className="w-4 h-4 text-electric-violet" />
                      AI Script Helper
                    </div>
                    <p className="text-[10px] text-slate-500">Provide a synopsis and generate screenplay scripts instantly.</p>
                  </button>

                  <button onClick={() => handleAiAction("Voice Over")} className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-electric-violet/30 text-left space-y-2 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Video className="w-4 h-4 text-cyan-accent" />
                      AI Voice Over Clone
                    </div>
                    <p className="text-[10px] text-slate-500">Convert script pages to high-quality binaural voice acting lines.</p>
                  </button>

                  <button onClick={() => handleAiAction("Caption Translator")} className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-electric-violet/30 text-left space-y-2 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Languages className="w-4 h-4 text-gold-accent" />
                      Automatic Translation
                    </div>
                    <p className="text-[10px] text-slate-500">Automatically translates scripts, novels, or subtitles for global fans.</p>
                  </button>

                  <button onClick={() => handleAiAction("Cover Generator")} className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-electric-violet/30 text-left space-y-2 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      AI Cover &amp; Art Generator
                    </div>
                    <p className="text-[10px] text-slate-500">Generates glassmorphic layouts and graphic banners for stories.</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Response Console */}
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4 flex flex-col justify-between min-h-[300px]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Operations Output</h3>

              <div className="flex-1 bg-slate-950/80 rounded-xl p-4 border border-white/5 font-mono text-[10px] text-slate-400 overflow-y-auto leading-relaxed relative min-h-[220px]">
                {aiLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-electric-violet">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-electric-violet mr-2" />
                    Processing request with Gemini...
                  </div>
                ) : aiResult ? (
                  <pre className="whitespace-pre-wrap">{aiResult}</pre>
                ) : (
                  <span className="text-slate-600 block text-center py-20">Input a prompt on the left and select an AI tool to execute operations.</span>
                )}
              </div>

              {aiResult && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveDraft}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    Save as Story Draft
                  </button>
                </div>
              )}

              <div className="text-[9px] text-slate-500 flex justify-between">
                <span>Model: Gemini-Flash-3.5</span>
                <span>Latency: 1.2s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
