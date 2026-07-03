"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Play, Plus, Star, Tv, Flame, Sparkles, UserCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeFeedContentProps {
  stories: any[];
  featuredUniverse: any;
  readingProgress: any[];
  creators: any[];
}

const categories = [
  "All Formats", "Romance ❤️", "Fantasy 🔮", "Action ⚔️", "Horror 💀", 
  "Comedy 🎭", "Sci-Fi 🚀", "Comics 🎨", "Audio 🎙️"
];

function SkeletonCard({ aspect = "aspect-[16/10]" }: { aspect?: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 space-y-3 animate-pulse">
      <div className={cn("w-full rounded-xl bg-white/5", aspect)} />
      <div className="space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function HomeFeedContent({
  stories,
  featuredUniverse,
  readingProgress,
  creators,
}: HomeFeedContentProps) {
  const [activeCategory, setActiveCategory] = useState("All Formats");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const catParam = searchParams?.get("category");

  useEffect(() => {
    if (catParam) {
      const matched = categories.find(c => c.toLowerCase().includes(catParam.toLowerCase()));
      if (matched) {
        setActiveCategory(matched);
      }
    }
  }, [catParam]);

  // Simulate skeleton loader transition for filters
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const storyTypeLabel: Record<string, string> = {
    NOVEL: "Novel",
    REEL: "Vertical Series",
    AUDIO: "Audio Book",
    COMIC: "Comic",
    INTERACTIVE: "Interactive",
  };

  // Filter stories based on active category
  const filteredStories = activeCategory === "All Formats"
    ? stories
    : stories.filter(story => {
        const genreMap: Record<string, string[]> = {
          "Romance ❤️": ["Romance"],
          "Fantasy 🔮": ["Fantasy"],
          "Action ⚔️": ["Action"],
          "Horror 💀": ["Horror"],
          "Comedy 🎭": ["Comedy"],
          "Sci-Fi 🚀": ["Sci-Fi"],
          "Comics 🎨": ["COMIC"],
          "Audio 🎙️": ["AUDIO"],
        };
        
        // Match either db types or genres
        const matchesType = story.type === "COMIC" && activeCategory.includes("Comics") ||
                            story.type === "AUDIO" && activeCategory.includes("Audio");
        const matchesGenre = genreMap[activeCategory]?.some(genre => 
          story.description?.toLowerCase().includes(genre.toLowerCase())
        );

        return matchesType || matchesGenre;
      });

  const verticalSeries = stories.filter(c => c.type === "REEL" || c.type === "COMIC");
  const recommendedStories = stories.slice(0, 3);

  return (
    <div className="space-y-10 pb-16">
      {/* Category Pills Header */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar select-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap border transition-all cursor-pointer duration-300",
              activeCategory === cat
                ? "bg-electric-violet border-electric-violet text-white shadow-lg shadow-electric-violet/20"
                : "bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="relative h-[380px] md:h-[450px] rounded-3xl bg-slate-900/40 animate-pulse border border-white/5" />
          <div className="space-y-4">
            <div className="h-5 bg-white/5 rounded w-1/4 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <SkeletonCard aspect="aspect-[9/16]" />
              <SkeletonCard aspect="aspect-[9/16]" />
              <SkeletonCard aspect="aspect-[9/16]" />
              <SkeletonCard aspect="aspect-[9/16]" />
              <SkeletonCard aspect="aspect-[9/16]" />
              <SkeletonCard aspect="aspect-[9/16]" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Universe Banner */}
          {featuredUniverse && (
            <div className="relative h-[380px] md:h-[450px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&fit=crop"
                alt="Featured Universe Banner"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />

              <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20 max-w-xl space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-electric-violet/20 border border-electric-violet/30 text-glow-purple text-[10px] font-bold text-electric-violet uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Featured Universe
                </div>

                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
                  {featuredUniverse.name}
                </h2>

                <p className="text-xs md:text-sm text-slate-300">
                  {featuredUniverse.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/universe/${featuredUniverse.id}`}
                    className="px-6 py-2.5 rounded-full bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-electric-violet/25"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Open Universe Hub
                  </Link>
                  <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/5 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Add to Playlist
                  </button>
                </div>
              </div>

              <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-950/80 border border-white/5 text-[10px] font-bold text-slate-300">
                  18+ Rated
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-950/80 border border-white/5 text-[10px] font-bold text-slate-300">
                  Action & Fantasy
                </span>
              </div>
            </div>
          )}

          {/* Reading Progress & Following Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-gold-accent" />
                Continue Reading Progress
              </h3>
              {readingProgress.length === 0 ? (
                <div className="p-8 rounded-2xl glass-panel border border-white/5 text-center text-xs text-slate-400">
                  No active reading history. Start exploring stories below!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {readingProgress.map((item) => (
                    <Link
                      key={item.id}
                      href={`/universe/${item.story.universeId}`}
                      className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-electric-violet/20 hover:bg-slate-900/40 transition-all flex gap-4 group cursor-pointer animate-fade-in"
                    >
                      <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img src={item.story.coverImage} alt={item.story.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <span className="text-[8px] font-bold text-electric-violet uppercase tracking-wider bg-electric-violet/10 px-1.5 py-0.5 rounded">
                            {storyTypeLabel[item.story.type] ?? item.story.type}
                          </span>
                          <h4 className="font-bold text-xs text-white truncate mt-1.5 group-hover:text-electric-violet transition-colors">
                            {item.story.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">Chapter Index {item.chapterIndex}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-500">
                            <span>Progress</span>
                            <span className="font-bold text-slate-300">{item.percent}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full bg-electric-violet" style={{ width: `${item.percent}%` }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Creators List */}
            <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4.5 h-4.5 text-cyan-accent" />
                Creators You Follow
              </h3>
              <div className="space-y-3">
                {creators.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      {c.profile?.avatarUrl ? (
                        <img src={c.profile.avatarUrl} alt={c.profile.displayName} className="w-8 h-8 rounded-full bg-gradient-to-tr from-electric-violet to-cyan-accent shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-electric-violet to-cyan-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.profile?.displayName?.charAt(0) || "C"}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-white">{c.profile?.displayName || "Creator"}</p>
                        <p className="text-[9px] text-slate-500 truncate max-w-[150px]">{c.profile?.bio || "Digital Architect"}</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-electric-violet" />
              Recommended For You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommendedStories.map((item) => (
                <Link
                  key={item.id}
                  href={`/universe/${item.universeId}`}
                  className="flex gap-4 p-4 rounded-2xl glass-panel border border-white/5 hover:border-gold-accent/25 hover:bg-slate-900/40 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-1 min-w-0">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        {storyTypeLabel[item.type] ?? item.type}
                      </span>
                      <h4 className="font-bold text-xs text-white group-hover:text-gold-accent transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                      <span className="font-semibold text-slate-400 truncate">{item.universe.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Reels (TikTok Mode) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-white">
                <Tv className="w-5 h-5 text-cyan-accent" />
                Trending Vertical Series (TikTok Mode)
              </h3>
            </div>
            {verticalSeries.length === 0 ? (
              <div className="text-slate-400 text-xs py-8 text-center glass-panel rounded-2xl border border-white/5">
                No active vertical drama series uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {verticalSeries.map((item) => (
                  <Link
                    key={item.id}
                    href={`/universe/${item.universeId}`}
                    className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-accent/40 shadow-xl group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-20 space-y-1">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-accent/20 border border-cyan-accent/30 text-[8px] font-bold text-cyan-accent uppercase tracking-wider">
                        {storyTypeLabel[item.type] ?? item.type}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate drop-shadow">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 truncate">{item.universe.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
