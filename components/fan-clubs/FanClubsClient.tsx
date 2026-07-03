"use client";

import React, { useState } from "react";
import { Users, Megaphone, HelpCircle, BarChart3, MessageSquare, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedType = "announcements" | "polls" | "qna" | "chat";

interface Creator {
  name: string;
  avatar: string;
  bio: string;
}

interface FanClubsClientProps {
  creator: Creator;
}

export default function FanClubsClient({ creator }: FanClubsClientProps) {
  const [activeFeed, setActiveFeed] = useState<FeedType>("announcements");
  const [pollVoted, setPollVoted] = useState(false);
  const [pollVotes, setPollVotes] = useState({ option1: 142, option2: 289 });

  const feeds = [
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "polls", label: "Fan Polls", icon: BarChart3 },
    { id: "qna", label: "Q&A Forum", icon: HelpCircle },
    { id: "chat", label: "Discord Chat", icon: MessageSquare },
  ];

  const handleVote = (option: "option1" | "option2") => {
    if (pollVoted) return;
    setPollVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
    setPollVoted(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Community Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-neon border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-electric-violet/40 shrink-0 relative z-10">
          <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-2 relative z-10 flex-1 text-center md:text-left">
          <span className="px-2 py-0.5 rounded bg-electric-violet/20 border border-electric-violet/30 text-glow-purple text-[9px] font-bold text-electric-violet uppercase tracking-widest">
            Fan Club Hub
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white">
            {creator.name}&apos;s Sanctuary
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Join announcements, participate in fan polls, ask questions, or chat live with other members of the Crimson Throne universe.
          </p>
        </div>

        <div className="flex gap-2 relative z-10">
          <button className="px-4 py-2.5 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-electric-violet/20">
            <Heart className="w-4 h-4 fill-white" />
            Joined Club
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
        {feeds.map((feed) => {
          const Icon = feed.icon;
          const isActive = activeFeed === feed.id;
          return (
            <button
              key={feed.id}
              onClick={() => setActiveFeed(feed.id as FeedType)}
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-300 cursor-pointer",
                isActive
                  ? "border-electric-violet text-white text-glow-violet bg-white/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-electric-violet" : "text-slate-500")} />
              {feed.label}
            </button>
          );
        })}
      </div>

      {/* Feed Content */}
      <div className="min-h-[300px]">
        {/* Announcements Tab */}
        {activeFeed === "announcements" && (
          <div className="space-y-6 max-w-3xl">
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-electric-violet/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-electric-violet text-glow-purple font-bold">
                  <Megaphone className="w-3.5 h-3.5" />
                  Official Announcement
                </span>
                <span>July 2, 2026</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-glow-violet transition-colors">
                Series Season 2 Adaption Confirmed! 🎬
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                I am thrilled to announce that the screenplay for *Shadows of the Crimson Crown* Season 2 has been approved! We are collaborating with new voice artists and illustrators to bring Dragon Peak to life in immersive 3D formats. Production starts next week.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-electric-violet text-glow-purple font-bold">
                  <Megaphone className="w-3.5 h-3.5" />
                  Collaboration Notice
                </span>
                <span>June 28, 2026</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Seeking Voice Actors for Audio Episodes 🎙️
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calling all voice actors in the AOM community! We are casting for Lydia the Witch for our upcoming binaural audio drama. If you have a clean setup, please send your voice demo folder through the Creator Studio Collaboration link.
              </p>
            </div>
          </div>
        )}

        {/* Fan Polls Tab */}
        {activeFeed === "polls" && (
          <div className="max-w-xl p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Fan Poll</span>
              <h3 className="text-base font-bold text-white">Which character origin should we explore in the next Comic?</h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleVote("option1")}
                className={cn(
                  "w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer",
                  pollVoted ? "bg-slate-900/40 border-white/5 pointer-events-none" : "bg-white/5 border-white/10 hover:border-electric-violet/30"
                )}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Lydia the Witch (Blood Alchemist)</p>
                  {pollVoted && (
                    <p className="text-[10px] text-slate-500">
                      {((pollVotes.option1 / (pollVotes.option1 + pollVotes.option2)) * 100).toFixed(0)}% • {pollVotes.option1} votes
                    </p>
                  )}
                </div>
                {pollVoted && (
                  <div
                    style={{ width: `${(pollVotes.option1 / (pollVotes.option1 + pollVotes.option2)) * 100}%` }}
                    className="h-1 bg-electric-violet rounded-full shrink-0 max-w-[100px]"
                  />
                )}
              </button>

              <button
                onClick={() => handleVote("option2")}
                className={cn(
                  "w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer",
                  pollVoted ? "bg-slate-900/40 border-white/5 pointer-events-none" : "bg-white/5 border-white/10 hover:border-electric-violet/30"
                )}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Commander Valen (Shadow Guard Leader)</p>
                  {pollVoted && (
                    <p className="text-[10px] text-slate-500">
                      {((pollVotes.option2 / (pollVotes.option1 + pollVotes.option2)) * 100).toFixed(0)}% • {pollVotes.option2} votes
                    </p>
                  )}
                </div>
                {pollVoted && (
                  <div
                    style={{ width: `${(pollVotes.option2 / (pollVotes.option1 + pollVotes.option2)) * 100}%` }}
                    className="h-1 bg-electric-violet rounded-full shrink-0 max-w-[100px]"
                  />
                )}
              </button>
            </div>

            {pollVoted && (
              <p className="text-[10px] text-emerald-400 font-semibold">Your vote has been cast. Poll ends in 3 days.</p>
            )}
          </div>
        )}

        {/* Q&A Forum Tab */}
        {activeFeed === "qna" && (
          <div className="space-y-4 max-w-3xl">
            <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                  SL
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">StarlightReader</span>
                    <span className="text-[10px] text-slate-500">July 1, 2026</span>
                  </div>
                  <p className="text-xs font-semibold text-white">Will the novel get a hardback physical print version in the creator shop?</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    I would absolutely love to buy a physical book for my collection library shelf!
                  </p>
                </div>
              </div>

              <div className="pl-11 border-l border-white/5 mt-3 space-y-3">
                <div className="flex items-start gap-3 bg-white/2 p-3 rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-electric-violet/40 shrink-0">
                    <img src={creator.avatar} alt="creator avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{creator.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-electric-violet/20 text-electric-violet text-[7px] font-bold">CREATOR</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Yes! We are working with the AOM Content Curator team to list limited hardback prints inside the Fan Shop next month. It will feature custom metallic dragon covers. Keep an eye out!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Discord Chat Tab */}
        {activeFeed === "chat" && (
          <div className="max-w-2xl p-6 rounded-2xl glass-panel border border-white/5 space-y-4 flex flex-col justify-between min-h-[350px]">
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 font-sans text-xs">
              <div className="space-y-1">
                <p className="text-slate-500 font-semibold"># lounge-chat</p>
                <div className="h-[1px] w-full bg-white/5" />
              </div>
              <div className="space-y-2.5">
                <div>
                  <span className="font-bold text-cyan-accent mr-1.5">Mindbender:</span>
                  <span className="text-slate-300">Can we talk about how cool the Bezier collaboration curves look on the global node graph page?</span>
                </div>
                <div>
                  <span className="font-bold text-pink-400 mr-1.5">LydiaFan:</span>
                  <span className="text-slate-300">Honestly this platform is so much better than traditional reading sites. Love the audio effects.</span>
                </div>
                <div>
                  <span className="font-bold text-amber-400 mr-1.5">ValenGuard:</span>
                  <span className="text-slate-300">Just voted in the poll, Commander Valen needs to win! We need a dark backstory.</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-white/5 pt-3">
              <input
                type="text"
                placeholder="Send a message to #lounge-chat..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl glass-input border border-white/10"
              />
              <button className="px-4 py-2.5 text-xs font-bold bg-electric-violet rounded-xl hover:bg-purple-700 cursor-pointer">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
