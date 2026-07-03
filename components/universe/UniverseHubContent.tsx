"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Calendar, MapPin, Users, BookOpen, ShieldAlert, 
  ChevronRight, Award, HelpCircle, Star, ShoppingBag, MessageSquare,
  Heart, ThumbsUp, Laugh, Send, Pin, AlertTriangle, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createCommentAction } from "@/app/actions/comments";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type TabName = "timeline" | "content" | "map" | "characters" | "shop" | "community" | "wiki";

interface UniverseHubContentProps {
  universe: any;
  stories: any[];
  characters: any[];
  comments: any[];
  currentUserId?: string;
}

export default function UniverseHubContent({
  universe,
  stories,
  characters,
  comments: dbComments,
  currentUserId,
}: UniverseHubContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabName>("timeline");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeWikiSec, setActiveWikiSec] = useState<string | null>("magic");

  // Comments & Spoiler States
  const [commentText, setCommentText] = useState("");
  const [spoilerMode, setSpoilerMode] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set());
  const [localReactions, setLocalReactions] = useState<Record<string, { heart: number; like: number; laugh: number }>>({});

  // Realtime comments listener
  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("universe-comments-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Comment" },
        () => {
          // Reactively pull down new comments from the database via Next.js Server Components
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const firstStoryId = stories[0]?.id;

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !firstStoryId) return;

    try {
      const formData = new FormData();
      formData.append("storyId", firstStoryId);
      formData.append("text", commentText);
      formData.append("spoiler", spoilerMode.toString());

      const result = await createCommentAction(formData);
      if (result.error) {
        alert(result.error);
      } else {
        setCommentText("");
        setSpoilerMode(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit comment.");
    }
  };

  const reactTo = (commentId: string, type: "heart" | "like" | "laugh") => {
    // Local simulation for high responsiveness
    setLocalReactions((prev) => {
      const current = prev[commentId] || { heart: 0, like: 0, laugh: 0 };
      return {
        ...prev,
        [commentId]: {
          ...current,
          [type]: current[type] + 1,
        },
      };
    });
  };

  const getCommentReactions = (comment: any) => {
    const local = localReactions[comment.id];
    return {
      heart: (comment.likes || 0) + (local?.heart || 0),
      like: (comment.hearts || 0) + (local?.like || 0),
      laugh: (comment.laughs || 0) + (local?.laugh || 0),
    };
  };

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const tabs: { id: TabName; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "content", label: "Franchise Works", icon: BookOpen },
    { id: "map", label: "Interactive Map", icon: MapPin },
    { id: "characters", label: "Character Wiki", icon: Users },
    { id: "wiki", label: "Lore Codex", icon: HelpCircle },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "shop", label: "Fan Shop", icon: ShoppingBag },
  ];

  const regions: Record<string, { title: string; desc: string; works: string }> = {
    r1: { title: "Dragon Peak", desc: "The birthplace of the blood sorcerers and dragons. Hidden in frozen mountains.", works: "Appears in: Crimson Kingdom: Origins" },
    r2: { title: "The Crimson Citadel", desc: "The grand throne room and seat of the royal ruler. Heavily guarded by the Shadow Guard.", works: "Appears in: The Crimson Throne (Novel) & Shadows of the Crimson Crown (Series)" },
    r3: { title: "Whispering Woods", desc: "A mystic woodland where ancient rebel magic is gathered by the witches.", works: "Appears in: The Crimson Throne (Novel)" },
  };

  const storyTypeLabel: Record<string, string> = {
    NOVEL: "Novel",
    REEL: "Vertical Series",
    AUDIO: "Audio Book",
    COMIC: "Comic",
    INTERACTIVE: "Interactive",
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="relative h-[280px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
        <img
          src={universe.coverImage || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=500&fit=crop"}
          alt={universe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="px-2.5 py-0.5 rounded bg-electric-violet/20 border border-electric-violet/30 text-glow-purple text-[9px] font-bold text-electric-violet uppercase tracking-widest">
              Universe Hub
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-none">{universe.name}</h1>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{universe.description}</p>
          </div>
          <div className="flex gap-4 text-xs font-bold text-slate-400 shrink-0">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-electric-violet" /> {stories.length} Works</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-cyan-accent" /> {characters.length} Characters</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-1 pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                activeTab === tab.id
                  ? "border-electric-violet text-electric-violet text-glow-purple"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="min-h-[300px]">
        {/* Timeline Panel */}
        {activeTab === "timeline" && (
          <div className="max-w-2xl mx-auto py-4 relative border-l border-white/10 space-y-8 pl-6">
            <div className="absolute top-0 left-0 -ml-[5px] w-2.5 h-2.5 rounded-full bg-electric-violet" />
            <div className="space-y-6">
              <div className="relative group">
                <span className="absolute -left-[31px] w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-electric-violet group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-bold text-electric-violet">Year 0</span>
                <h3 className="font-bold text-sm text-white mt-0.5">The Dragon Pact</h3>
                <p className="text-xs text-slate-400 mt-1">The five royal bloodlines sign the ancient pact, binding their lineages to the dragon lords.</p>
              </div>
              <div className="relative group">
                <span className="absolute -left-[31px] w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-electric-violet group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-bold text-electric-violet">Year 350</span>
                <h3 className="font-bold text-sm text-white mt-0.5">The Crimson Rebellion</h3>
                <p className="text-xs text-slate-400 mt-1">Three dragon lords fall as rebellion sweeps the western borders. Witches forge the magic stones.</p>
              </div>
              <div className="relative group">
                <span className="absolute -left-[31px] w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-electric-violet group-hover:scale-125 transition-transform" />
                <span className="text-[10px] font-bold text-electric-violet">Year 500</span>
                <h3 className="font-bold text-sm text-white mt-0.5">Events of The Crimson Throne</h3>
                <p className="text-xs text-slate-400 mt-1">Elara of Ash discovers her heritage, setting off a chain reaction of courtly intrigue.</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Works Panel */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="p-4 rounded-2xl glass-panel border border-white/5 flex gap-4 hover:border-electric-violet/20 hover:scale-[1.01] transition-all">
                <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                      {storyTypeLabel[story.type] ?? story.type}
                    </span>
                    <h3 className="font-bold text-sm text-white truncate mt-1">{story.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{story.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-0.5 text-gold-accent font-bold">
                      <Star className="w-3.5 h-3.5 fill-gold-accent" /> {story.rating.toFixed(1)}
                    </span>
                    <Link href={`/universe/${universe.id}`} className="text-electric-violet hover:underline flex items-center font-bold">
                      Open <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Map Panel */}
        {activeTab === "map" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 bg-slate-950 shadow-inner group">
              <img
                src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1000&fit=crop"
                alt="Fantasy Cartography Map"
                className="w-full h-full object-cover opacity-35 filter sepia hue-rotate-15 group-hover:scale-[1.02] transition-transform duration-1000"
              />
              <button
                onClick={() => setSelectedRegion("r1")}
                className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-electric-violet/40 hover:bg-electric-violet border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse hover:scale-110 transition-all cursor-pointer"
              >
                1
              </button>
              <button
                onClick={() => setSelectedRegion("r2")}
                className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-cyan-accent/40 hover:bg-cyan-accent border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse hover:scale-110 transition-all cursor-pointer"
              >
                2
              </button>
              <button
                onClick={() => setSelectedRegion("r3")}
                className="absolute top-2/3 left-1/4 w-8 h-8 rounded-full bg-purple-500/40 hover:bg-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse hover:scale-110 transition-all cursor-pointer"
              >
                3
              </button>
            </div>
            <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col justify-center space-y-4">
              {selectedRegion ? (
                <>
                  <span className="text-[10px] font-bold text-electric-violet uppercase tracking-widest">Selected Landmark</span>
                  <h3 className="font-bold text-lg text-white">{regions[selectedRegion].title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{regions[selectedRegion].desc}</p>
                  <p className="text-[10px] text-slate-500 border-t border-white/5 pt-3 font-semibold">{regions[selectedRegion].works}</p>
                </>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500 space-y-2">
                  <MapPin className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Click on any marker on the map to explore lore landmarks and locations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Character Wiki Panel */}
        {activeTab === "characters" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => (
              <div key={char.id} className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-electric-violet/40">
                  <img src={char.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"} alt={char.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-white">{char.name}</h3>
                  <p className="text-xs text-electric-violet text-glow-purple font-semibold">{char.role}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{char.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Lore Wiki Panel */}
        {activeTab === "wiki" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveWikiSec("magic")}
                  className={cn("px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer", activeWikiSec === "magic" ? "bg-electric-violet/20 border-electric-violet/30 text-electric-violet" : "border-white/5 text-slate-400 hover:text-white")}
                >
                  Magic System
                </button>
                <button
                  onClick={() => setActiveWikiSec("factions")}
                  className={cn("px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer", activeWikiSec === "factions" ? "bg-electric-violet/20 border-electric-violet/30 text-electric-violet" : "border-white/5 text-slate-400 hover:text-white")}
                >
                  Factions
                </button>
              </div>
            </div>

            {activeWikiSec === "magic" ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                  <h4 className="font-bold text-sm text-white">Dragon Blood Sorcery</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Blood alchemists bind elemental spirits directly to human veins. This requires pure ancestry or consuming dragon seeds, which causes terminal calcification over decades.</p>
                </div>
                <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                  <h4 className="font-bold text-sm text-white">The Three Lore Gems</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Forged during the Crimson Rebellion, these gems can store and magnify elemental charges, but they slowly drain the life force of whoever holds them.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                  <h4 className="font-bold text-sm text-white">The Shadow Guard</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Sworn defenders of the Citadel who wear masks forged from Obsidian scales, rendering their faces and motives invisible to the public court.</p>
                </div>
                <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-2">
                  <h4 className="font-bold text-sm text-white">The Ash-Pit Rebels</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">A coalition of peasants and outcasts working out of abandoned mines, hoping to break the dragon lineage stranglehold on the kingdom.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Community Panel */}
        {activeTab === "community" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Post Comment Input */}
            <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-3">
              <form onSubmit={postComment} className="space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts, theories, or reactions..."
                  className="w-full px-4 py-3 text-sm rounded-xl glass-input border border-white/10 h-24 resize-none"
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSpoilerMode(!spoilerMode)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                      spoilerMode
                        ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    )}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {spoilerMode ? "Spoiler Tag: ON" : "Mark as Spoiler"}
                  </button>
                  <button
                    type="submit"
                    disabled={!commentText.trim() || !firstStoryId}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-electric-violet hover:bg-purple-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Comment
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {dbComments.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  No community comments yet. Start the conversation!
                </div>
              ) : (
                dbComments.map((comment) => {
                  const reactions = getCommentReactions(comment);
                  const isPinned = comment.pinned;
                  return (
                    <div
                      key={comment.id}
                      className={cn(
                        "p-5 rounded-2xl glass-panel border space-y-3 transition-colors animate-fade-in",
                        isPinned ? "border-electric-violet/30 bg-electric-violet/5" : "border-white/5"
                      )}
                    >
                      {/* Author row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-electric-violet to-cyan-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {comment.user.profile?.displayName?.charAt(0) || "U"}
                          </div>
                          <span className="text-xs font-bold text-white">
                            {comment.user.profile?.displayName || "Reader"}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          {isPinned && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-electric-violet/20 text-electric-violet text-[9px] font-bold">
                              <Pin className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                        </div>
                        {comment.spoiler && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Spoiler
                          </span>
                        )}
                      </div>

                      {/* Comment text (spoiler handling) */}
                      {comment.spoiler && !revealedSpoilers.has(comment.id) ? (
                        <button
                          onClick={() => toggleSpoiler(comment.id)}
                          className="w-full py-3 rounded-xl bg-amber-500/10 border border-dashed border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-500/15 transition-colors"
                        >
                          <EyeOff className="w-4 h-4" /> Click to reveal spoiler
                        </button>
                      ) : (
                        <div className="relative">
                          <p className="text-sm text-slate-300 leading-relaxed">{comment.text}</p>
                          {comment.spoiler && (
                            <button onClick={() => toggleSpoiler(comment.id)} className="mt-1 flex items-center gap-1 text-[9px] text-amber-500 hover:text-amber-400 cursor-pointer">
                              <EyeOff className="w-3 h-3" /> Hide spoiler
                            </button>
                          )}
                        </div>
                      )}

                      {/* Reactions */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => reactTo(comment.id, "heart")} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/15 text-slate-400 hover:text-red-400 text-xs transition-all cursor-pointer">
                          <Heart className="w-3.5 h-3.5" /> {reactions.heart}
                        </button>
                        <button onClick={() => reactTo(comment.id, "like")} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-500/15 text-slate-400 hover:text-blue-400 text-xs transition-all cursor-pointer">
                          <ThumbsUp className="w-3.5 h-3.5" /> {reactions.like}
                        </button>
                        <button onClick={() => reactTo(comment.id, "laugh")} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-yellow-500/15 text-slate-400 hover:text-yellow-400 text-xs transition-all cursor-pointer">
                          <Laugh className="w-3.5 h-3.5" /> {reactions.laugh}
                        </button>
                      </div>

                      {/* Threaded Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-4 pl-4 border-l-2 border-white/5 space-y-3">
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                  {reply.user?.profile?.displayName?.charAt(0) || "U"}
                                </div>
                                <span className="text-[10px] font-bold text-slate-300">
                                  {reply.user?.profile?.displayName || "Reader"}
                                </span>
                                <span className="text-[9px] text-slate-600">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Fan Shop Panel */}
        {activeTab === "shop" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between hover:scale-[1.01] transition-all">
              <div className="space-y-3">
                <div className="aspect-square rounded-xl bg-slate-900 overflow-hidden relative border border-white/5">
                  <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300" alt="Item" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">Shadow Guard Scale Mask</h4>
                  <p className="text-xs text-slate-400">Official metal replica of Commander Valen's mask.</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4">
                <span className="font-bold text-cyan-accent text-sm">450 Tokens</span>
                <button className="px-4 py-1.5 rounded-lg bg-electric-violet hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer">
                  Purchase
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between hover:scale-[1.01] transition-all">
              <div className="space-y-3">
                <div className="aspect-square rounded-xl bg-slate-900 overflow-hidden relative border border-white/5">
                  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300" alt="Item" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">The Crimson Throne Poster</h4>
                  <p className="text-xs text-slate-400">High-gloss limited edition illustrated art poster.</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-4">
                <span className="font-bold text-cyan-accent text-sm">150 Tokens</span>
                <button className="px-4 py-1.5 rounded-lg bg-electric-violet hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer">
                  Purchase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
