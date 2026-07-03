"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, 
  Settings, Type, CheckCircle, Sparkles, AlertTriangle, 
  Tv, BookOpen, Headphones, Disc, ChevronRight, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { saveReadingProgressAction } from "@/app/actions/settings";

interface Chapter {
  id: string;
  title: string;
  content: string;
  index: number;
}

interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
  coverImage: string;
}

interface AudioTrack {
  id: string;
  name: string;
  description: string;
}

const mockAudioTracks: AudioTrack[] = [
  { id: "aud_ambient", name: "Binaural Dungeon Ambient", description: "3D wind and dripping chains" },
  { id: "aud_orchestral", name: "Citadel Courtly Intrigue", description: "Violins and dark harpsichord" },
  { id: "aud_action", name: "Dragon Awakening Drums", description: "Epic cinematic drums" }
];

// High-fidelity fallback/default episodes matching the themed seeded stories
const fallbackEpisodes: Episode[] = [
  {
    id: "ep_1",
    title: "Episode 1: Raw Fire",
    duration: "1:45",
    description: "Elara accidentally unleashes the dragon flame in the coal mines, halting the smelting carts and drawing the attention of the guards.",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&fit=crop"
  },
  {
    id: "ep_2",
    title: "Episode 2: The Inquest Begins",
    duration: "2:10",
    description: "Commander Valen dispatches the Shadow Guard to locate the dragon-blooded girl before the Chancellor's inquisitors take her life.",
    coverImage: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=500&fit=crop"
  },
  {
    id: "ep_3",
    title: "Episode 3: Obsidian Chambers",
    duration: "1:55",
    description: "Elara is brought before the high lords in handcuffs. A silent signal from Valen gives her the courage to defy the Chancellor.",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&fit=crop"
  }
];

interface SideBySideReaderClientProps {
  universe: {
    id: string;
    name: string;
    description: string | null;
  };
  storyId: string;
  chapters: Chapter[];
  episodes: Episode[];
  initialChapterIndex: number;
  initialPercent: number;
}

export default function SideBySideReaderClient({
  universe,
  storyId,
  chapters,
  episodes = [],
  initialChapterIndex,
  initialPercent,
}: SideBySideReaderClientProps) {
  // Active States
  const [activeTab, setActiveTab] = useState<"read" | "watch">("read"); // Mobile toggle
  const [activeChapterIndex, setActiveChapterIndex] = useState(
    initialChapterIndex < chapters.length ? initialChapterIndex : 0
  );
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [readerTheme, setReaderTheme] = useState<"cosmic" | "slate" | "sepia" | "midnight">("cosmic");
  
  // Sync States
  const [isSynced, setIsSynced] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState(mockAudioTracks[0]);

  // Reading progress tracking
  const [scrollPercent, setScrollPercent] = useState(initialPercent || 0);
  const lastSavedPercent = useRef(initialPercent || 0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Video simulated timeline runner
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentChapter = chapters[activeChapterIndex] || {
    id: "temp",
    title: "No chapters available",
    content: "Please write chapters or seed the database.",
    index: 1,
  };

  // Combine DB episodes and fallback episodes
  const displayEpisodes = episodes.length > 0 ? episodes : fallbackEpisodes;
  const currentEpisode = displayEpisodes[activeChapterIndex % displayEpisodes.length] || displayEpisodes[0];

  // Restore scroll position on mount or when chapter changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Small timeout to allow content layout to stabilize
      const timer = setTimeout(() => {
        const scrollHeight = container.scrollHeight - container.clientHeight;
        if (scrollHeight > 0) {
          container.scrollTop = (scrollPercent / 100) * scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeChapterIndex]);

  // Synchronize Chapter index when active episode is changed, or vice versa
  const handleChapterChange = async (idx: number) => {
    // Save final progress for this chapter before switching
    await saveProgressToDatabase(activeChapterIndex, scrollPercent);

    setActiveChapterIndex(idx);
    setVideoProgress(0);
    setIsPlayingVideo(false);
    setScrollPercent(0);
    lastSavedPercent.current = 0;

    if (isPlayingAudio) {
      confetti({
        particleCount: 20,
        spread: 30,
        colors: ["#7c3aed", "#06b6d4"]
      });
    }
  };

  const handleEpisodeChange = (epId: string) => {
    const epIdx = displayEpisodes.findIndex(ep => ep.id === epId);
    if (epIdx !== -1) {
      const matchingChapIdx = epIdx % chapters.length;
      handleChapterChange(matchingChapIdx);
    }
  };

  // Persists reading progress to Supabase/PostgreSQL
  const saveProgressToDatabase = async (chapIdx: number, percent: number) => {
    try {
      const formData = new FormData();
      formData.set("storyId", storyId);
      formData.set("chapterIndex", chapIdx.toString());
      formData.set("percent", percent.toString());
      await saveReadingProgressAction(formData);
      lastSavedPercent.current = percent;
    } catch (err) {
      console.error("Failed to persist reading progress:", err);
    }
  };

  // Scroll handler with throttling (200ms)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight <= 0) return;

    const currentPercent = Math.min(100, Math.max(0, Math.round((target.scrollTop / scrollHeight) * 100)));
    setScrollPercent(currentPercent);

    // Throttled database saving
    if (!throttleTimeoutRef.current) {
      throttleTimeoutRef.current = setTimeout(() => {
        throttleTimeoutRef.current = null;
        
        // Save to DB under 2 conditions:
        // 1. Progress hit a 10% checkpoint (e.g. 10%, 20%, 30%, etc.) and is greater than last saved percent
        const hitTenPercentCheckpoint = Math.floor(currentPercent / 10) * 10;
        const previousDecile = Math.floor(lastSavedPercent.current / 10) * 10;

        if (hitTenPercentCheckpoint > previousDecile) {
          saveProgressToDatabase(activeChapterIndex, currentPercent);
        }
      }, 200);
    }
  };

  // Save progress on unmount / navigation away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgressToDatabase(activeChapterIndex, scrollPercent);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
      saveProgressToDatabase(activeChapterIndex, scrollPercent);
    };
  }, [activeChapterIndex, scrollPercent]);

  // Video progress simulator
  useEffect(() => {
    if (isPlayingVideo) {
      videoIntervalRef.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlayingVideo(false);
            clearInterval(videoIntervalRef.current!);
            
            // Trigger confetti on episode complete as a reward hook!
            confetti({
              particleCount: 40,
              spread: 50,
              origin: { y: 0.6 }
            });
            
            // If synced, automatically suggest next chapter or auto-advance
            if (isSynced && activeChapterIndex < chapters.length - 1) {
              setTimeout(() => {
                handleChapterChange(activeChapterIndex + 1);
              }, 1500);
            }
            return 100;
          }
          return prev + 1.5;
        });
      }, 250);
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    }

    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isPlayingVideo, activeChapterIndex, isSynced, chapters.length]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* 1. Header Toolbar */}
      <header className="h-16 px-4 md:px-8 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href={`/universe/${universe.id}`}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              {universe.name}
              <span className="hidden sm:inline px-2 py-0.5 text-[9px] bg-electric-violet/20 border border-electric-violet/30 text-electric-violet rounded">
                Dual Mode
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 hidden sm:block">Syncing Novel &amp; Drama Reels</p>
          </div>
        </div>

        {/* Desktop Preferences */}
        <div className="flex items-center gap-4">
          
          {/* Sync Mode Switcher */}
          <button
            onClick={() => {
              setIsSynced(!isSynced);
              confetti({
                particleCount: 15,
                colors: ["#a855f7"]
              });
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
              isSynced 
                ? "bg-electric-violet/10 border-electric-violet/30 text-electric-violet text-glow-purple"
                : "bg-white/5 border-white/5 text-slate-400"
            )}
          >
            <Zap className={cn("w-3.5 h-3.5", isSynced ? "fill-electric-violet animate-pulse" : "")} />
            {isSynced ? "Chapters Synced" : "Un-synced"}
          </button>

          {/* Reader Preferences Drawer/Toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-lg p-1">
            <button
              onClick={() => {
                if (fontSize === "sm") setFontSize("base");
                else if (fontSize === "base") setFontSize("lg");
                else if (fontSize === "lg") setFontSize("xl");
                else setFontSize("sm");
              }}
              className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
              title="Change font size"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (readerTheme === "cosmic") setReaderTheme("slate");
                else if (readerTheme === "slate") setReaderTheme("sepia");
                else if (readerTheme === "sepia") setReaderTheme("midnight");
                else setReaderTheme("cosmic");
              }}
              className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
              title="Change background theme"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Toggle (Hidden on Desktop) */}
      <div className="flex lg:hidden bg-slate-900 border-b border-white/5 sticky top-16 z-20">
        <button
          onClick={() => setActiveTab("read")}
          className={cn(
            "flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2",
            activeTab === "read" ? "border-electric-violet text-white" : "border-transparent text-slate-400"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Read Novel
        </button>
        <button
          onClick={() => setActiveTab("watch")}
          className={cn(
            "flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2",
            activeTab === "watch" ? "border-electric-violet text-white" : "border-transparent text-slate-400"
          )}
        >
          <Tv className="w-4 h-4" />
          Watch Adaptation
        </button>
      </div>

      {/* 2. Main Split Area */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* LEFT COLUMN: Novel Reader */}
        <section 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={cn(
            "w-full lg:w-[55%] flex flex-col border-r border-white/5 overflow-y-auto transition-all",
            activeTab === "read" ? "block" : "hidden lg:flex",
            readerTheme === "cosmic" && "bg-cosmic-bg text-slate-200",
            readerTheme === "slate" && "bg-slate-900 text-slate-100",
            readerTheme === "sepia" && "bg-amber-950/20 text-amber-100",
            readerTheme === "midnight" && "bg-black text-slate-300"
          )}
        >
          {/* Reader Top Settings Bar */}
          <div className="p-4 md:p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-3 bg-slate-950/40 sticky top-0 z-10 backdrop-blur-sm">
            {/* Chapter Selection Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Read:</span>
              <select
                value={activeChapterIndex}
                onChange={(e) => handleChapterChange(Number(e.target.value))}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-electric-violet cursor-pointer"
              >
                {chapters.map((ch, idx) => (
                  <option key={ch.id} value={idx}>
                    Chapter {ch.index}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[10px] text-slate-500 font-semibold">
              Words: {currentChapter.content.split(/\s+/).length} | Progress: {scrollPercent}%
            </div>
          </div>

          {/* Reading Scroll Body */}
          <article className="flex-1 p-6 md:p-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight border-b border-white/5 pb-4">
              {currentChapter.title}
            </h2>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Scroll is automatically bookmarked to your account.
            </div>

            <div 
              className={cn(
                "leading-relaxed space-y-6 select-text",
                fontSize === "sm" && "text-sm",
                fontSize === "base" && "text-base",
                fontSize === "lg" && "text-lg",
                fontSize === "xl" && "text-xl"
              )}
            >
              {currentChapter.content.split("\n\n").map((para, i) => (
                <p 
                  key={i} 
                  className={cn(
                    "hover:bg-white/2 p-2 rounded-lg cursor-pointer transition-colors relative group/para",
                    i === 0 && isSynced && "bg-electric-violet/5 border-l-2 border-electric-violet"
                  )}
                >
                  {para}
                  
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 hidden group-hover/para:inline-flex items-center justify-center w-6 h-6 rounded-full bg-electric-violet border border-electric-violet/30 text-white cursor-pointer shadow-lg">
                    <Play className="w-2.5 h-2.5 fill-white" />
                  </span>
                </p>
              ))}
            </div>

            {/* Chapter Footer Actions */}
            <div className="pt-8 border-t border-white/5 flex justify-between items-center">
              <button
                disabled={activeChapterIndex === 0}
                onClick={() => handleChapterChange(activeChapterIndex - 1)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors cursor-pointer"
              >
                Previous Chapter
              </button>
              <button
                disabled={activeChapterIndex === chapters.length - 1}
                onClick={() => handleChapterChange(activeChapterIndex + 1)}
                className="px-4 py-2 rounded-lg bg-electric-violet text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Next Chapter
              </button>
            </div>
          </article>
        </section>

        {/* RIGHT COLUMN: Vertical Reel Player */}
        <section 
          className={cn(
            "w-full lg:w-[45%] bg-slate-950 flex flex-col justify-between overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6",
            activeTab === "watch" ? "block" : "hidden lg:flex"
          )}
        >
          {/* Section Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-cyan-accent" />
              Vertical Adaptation
            </h3>

            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
              TikTok Reel Mode
            </span>
          </div>

          {/* Immersive 9:16 Mobile Mockup Container */}
          <div className="relative aspect-[9/16] max-h-[500px] md:max-h-[580px] w-full max-w-[310px] mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black group">
            
            {/* Background Cover/Video Stream Simulation */}
            <div className="absolute inset-0 z-0">
              <img 
                src={currentEpisode.coverImage} 
                alt={currentEpisode.title} 
                className="w-full h-full object-cover brightness-[0.75]" 
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
            </div>

            {isPlayingVideo && (
              <div className="absolute bottom-16 left-4 z-20 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
                <Disc className="w-3 h-3 text-cyan-accent animate-spin" />
                <span className="text-[8px] font-bold text-slate-300">Live Drama Streaming...</span>
              </div>
            )}

            {/* Floating Control Overlays (TikTok side layout) */}
            <div className="absolute right-3 bottom-24 z-20 flex flex-col gap-4 text-center select-none">
              <button 
                onClick={() => confetti({ particleCount: 20 })} 
                className="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-rose-500 cursor-pointer"
              >
                ❤️
              </button>
              <span className="text-[9px] text-slate-400 font-bold -mt-3.5">42K</span>

              <button 
                onClick={() => alert("Opening Creator Fan Club!")}
                className="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-slate-300 cursor-pointer"
              >
                💬
              </button>
              <span className="text-[9px] text-slate-400 font-bold -mt-3.5">1.2K</span>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-slate-300 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>

            {/* Episode Titles & Subtitles Overlay */}
            <div className="absolute bottom-4 left-4 right-16 z-20 space-y-2">
              <span className="px-2 py-0.5 rounded bg-cyan-accent text-slate-950 text-[8px] font-black uppercase tracking-wider">
                {currentEpisode.id.toUpperCase()}
              </span>
              <h4 className="text-sm font-black text-white drop-shadow-md">
                {currentEpisode.title}
              </h4>
              <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed drop-shadow-sm">
                {currentEpisode.description}
              </p>

              {isPlayingVideo && (
                <div className="py-1 px-2 rounded bg-black/60 border border-white/5 text-[9px] text-amber-300 font-medium text-center">
                  {activeChapterIndex === 0 && "Elara: \"My hand... it feels like it is on fire!\""}
                  {activeChapterIndex === 1 && "Valen: \"We must get to Oakhaven before the Inquisitor.\""}
                  {activeChapterIndex === 2 && "Elara: \"I stand here under dragon's law.\""}
                </div>
              )}
            </div>

            {/* Central Play/Pause Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              {!isPlayingVideo && (
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-16 h-16 rounded-full bg-cyan-accent flex items-center justify-center shadow-2xl shadow-cyan-accent/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
                >
                  <Play className="w-6 h-6 fill-slate-950 text-slate-950 translate-x-0.5" />
                </button>
              )}
            </div>

            {/* Bottom Progress Bar Overlay */}
            <div className="absolute bottom-0 inset-x-0 z-20 h-1 bg-slate-800">
              <div 
                style={{ width: `${videoProgress}%` }} 
                className="h-full bg-cyan-accent transition-all duration-300" 
              />
            </div>

          </div>

          {/* Episode Selector Rows */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Franchise Episodes ({displayEpisodes.length})
            </h4>

            <div className="space-y-2">
              {displayEpisodes.map((ep) => {
                const isActive = ep.id === currentEpisode.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleEpisodeChange(ep.id)}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer",
                      isActive 
                        ? "bg-cyan-950/20 border-cyan-400/30 text-white" 
                        : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-slate-800 overflow-hidden shrink-0">
                        <img src={ep.coverImage} alt={ep.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{ep.title}</p>
                        <p className="text-[9px] text-slate-500">Duration: {ep.duration}m</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="p-1 rounded-full bg-cyan-400/20 text-cyan-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </section>

      </main>

      {/* 3. Immersive Audio Player Bar */}
      <footer className="h-20 border-t border-white/5 bg-slate-950 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 py-3 sticky bottom-0 z-30 shadow-2xl">
        
        {/* Track Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-electric-violet/10 border border-electric-violet/20 flex items-center justify-center text-electric-violet shrink-0">
            <Headphones className={cn("w-5 h-5", isPlayingAudio ? "animate-bounce" : "")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">{selectedAudioTrack.name}</h4>
              <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-black uppercase">
                Binaural 3D
              </span>
            </div>
            <p className="text-[9px] text-slate-500">{selectedAudioTrack.description}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleChapterChange(activeChapterIndex)} 
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="w-9 h-9 rounded-full bg-electric-violet hover:bg-purple-700 text-white flex items-center justify-center transition-colors shadow-lg shadow-electric-violet/20 cursor-pointer border-none"
          >
            {isPlayingAudio ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>

          {/* Equalizer animation bar when playing */}
          <div className="flex items-end gap-0.5 h-4 select-none">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div
                key={bar}
                style={{ 
                  height: isPlayingAudio ? `${Math.floor(Math.random() * 16) + 4}px` : "2px"
                }}
                className="w-0.75 bg-electric-violet transition-all duration-300 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Track Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-bold text-slate-500">Theme Track:</span>
          <select
            value={selectedAudioTrack.id}
            onChange={(e) => {
              const track = mockAudioTracks.find(t => t.id === e.target.value);
              if (track) setSelectedAudioTrack(track);
            }}
            className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-electric-violet cursor-pointer"
          >
            {mockAudioTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>
        </div>

      </footer>

    </div>
  );
}
