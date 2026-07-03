"use client";

import React, { useState } from "react";
import {
  Trophy, Award, Gift, Calendar, CheckCircle2, Star, Sparkles,
  TrendingUp, Target, Zap, Crown, Medal, ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

const LEADERBOARD = [
  { rank: 1, name: "StarlightReader", xp: 9_840, avatar: "S", color: "from-gold-accent to-amber-600" },
  { rank: 2, name: "WitchOfAsh", xp: 7_210, avatar: "W", color: "from-slate-300 to-slate-500" },
  { rank: 3, name: "LunaEchoes", xp: 6_550, avatar: "L", color: "from-amber-600 to-orange-700" },
  { rank: 4, name: "CrimsonRider", xp: 4_300, avatar: "C", color: "from-electric-violet to-purple-700" },
  { rank: 5, name: "You ✨", xp: 2_400, avatar: "Y", color: "from-cyan-accent to-cyan-700" },
];

export default function AchievementsPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [claimedReward, setClaimedReward] = useState(false);
  const [xp, setXp] = useState(2_400);
  const [missions, setMissions] = useState([
    { id: "m1", label: "Read 1 chapter today", xpReward: 50, done: false, icon: "📖" },
    { id: "m2", label: "Watch 1 vertical reel", xpReward: 30, done: false, icon: "📱" },
    { id: "m3", label: "Post a comment", xpReward: 20, done: false, icon: "💬" },
  ]);

  const XP_GOAL = 3_000;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpPercent = Math.round((xpInLevel / 500) * 100);

  const achievements = [
    { id: "ach_1", title: "Lore Explorer", desc: "Unlock 3 distinct media formats in a single Story Universe.", badge: "🔮", completed: true, progress: "3/3" },
    { id: "ach_2", title: "Binaural Enthusiast", desc: "Listen to 5 hours of 3D audio stories.", badge: "🎧", completed: false, progress: "2.4 / 5.0 hrs" },
    { id: "ach_3", title: "First-Tier Supporter", desc: "Send tips or purchase paid episodes from a Creator.", badge: "🪙", completed: true, progress: "1/1" },
    { id: "ach_4", title: "Codex Editor", desc: "Submit an approved character bio edit to a Wiki page.", badge: "✍️", completed: false, progress: "0/1" },
    { id: "ach_5", title: "Universe Marathoner", desc: "Spend 10+ hours inside a single Universe Hub.", badge: "🌌", completed: false, progress: "6.2 / 10 hrs" },
    { id: "ach_6", title: "Community Voice", desc: "Post 10 comments that receive at least 1 reaction.", badge: "🗣️", completed: false, progress: "7/10" },
  ];

  const completeMission = (id: string, reward: number) => {
    setMissions((prev) => prev.map((m) => m.id === id ? { ...m, done: true } : m));
    setXp((prev) => prev + reward);
    const allDone = missions.filter((m) => m.id !== id).every((m) => m.done);
    if (allDone) {
      confetti({ particleCount: 120, spread: 80, colors: ["#fbbf24", "#7c3aed", "#06b6d4"] });
    }
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    setXp((prev) => prev + 10);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ["#fbbf24", "#7c3aed"] });
  };

  const handleClaim = () => {
    setClaimedReward(true);
    confetti({ particleCount: 100, spread: 70, colors: ["#06b6d4", "#fbbf24"] });
  };

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-gold-accent" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-xs font-bold text-slate-500">#{rank}</span>;
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-gold-accent" />
          Achievements & Rewards
        </h1>
        <p className="text-xs text-slate-400">
          Complete daily missions, earn XP, climb the leaderboard, and unlock narrative badges.
        </p>
      </div>

      {/* XP Level Bar */}
      <div className="p-6 rounded-2xl glass-panel-neon border border-white/10 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-electric-violet/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-electric-violet to-cyan-accent flex items-center justify-center shadow-lg shadow-electric-violet/30">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Level</p>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Level {level}
                <span className="text-sm font-semibold text-electric-violet text-glow-violet">
                  {level <= 3 ? "Apprentice" : level <= 6 ? "Storyteller" : level <= 9 ? "Lore Keeper" : "Grand Archivist"}
                </span>
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold">Total XP</p>
            <p className="text-lg font-black text-gold-accent">{xp.toLocaleString()}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
            <span>{xpInLevel} XP in this level</span>
            <span>500 XP to Level {level + 1}</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-electric-violet to-cyan-accent shadow-lg shadow-electric-violet/40 transition-all duration-700"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-600">
            <span>Lv {level}</span>
            <span>{xpPercent}%</span>
            <span>Lv {level + 1}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Achievements + Daily Missions */}
        <div className="lg:col-span-2 space-y-6">

          {/* Daily Missions */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-accent" />
              Daily Missions
              <span className="text-xs text-slate-500 font-normal ml-1">
                {missions.filter((m) => m.done).length}/{missions.length} completed
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all duration-300 space-y-3",
                    mission.done
                      ? "glass-panel border-emerald-500/20 bg-emerald-950/5"
                      : "glass-panel border-white/5 hover:border-electric-violet/20"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{mission.icon}</span>
                    {mission.done
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      : <span className="text-[10px] font-bold text-gold-accent bg-gold-accent/10 px-2 py-0.5 rounded-full">+{mission.xpReward} XP</span>
                    }
                  </div>
                  <p className="text-xs font-semibold text-white leading-snug">{mission.label}</p>
                  <button
                    disabled={mission.done}
                    onClick={() => completeMission(mission.id, mission.xpReward)}
                    className={cn(
                      "w-full py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                      mission.done
                        ? "bg-emerald-500/10 text-emerald-400 cursor-not-allowed"
                        : "bg-electric-violet hover:bg-purple-700 text-white hover:scale-[1.02]"
                    )}
                  >
                    {mission.done ? "✓ Done" : "Complete"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-electric-violet" />
              Milestones
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={cn(
                    "p-5 rounded-2xl glass-panel border flex items-start gap-4 transition-colors",
                    ach.completed ? "border-emerald-500/20 bg-emerald-950/5" : "border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="text-3xl shrink-0 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    {ach.badge}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-white">{ach.title}</h3>
                      {ach.completed && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[7px] font-bold shrink-0">DONE</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{ach.desc}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                        {ach.progress}
                      </span>
                      {!ach.completed && (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard + Daily Check-In + Points */}
        <div className="space-y-6">

          {/* Weekly Leaderboard */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-electric-violet" />
              Weekly Leaderboard
            </h3>
            <div className="space-y-2">
              {LEADERBOARD.map((entry) => (
                <div
                  key={entry.rank}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-xl transition-colors",
                    entry.name.includes("You") ? "bg-electric-violet/10 border border-electric-violet/20" : "hover:bg-white/5"
                  )}
                >
                  <div className="w-5 flex items-center justify-center shrink-0">
                    {rankIcon(entry.rank)}
                  </div>
                  <div className={cn("w-8 h-8 rounded-full bg-gradient-to-tr flex items-center justify-center text-white font-bold text-xs shrink-0", entry.color)}>
                    {entry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-bold truncate", entry.name.includes("You") ? "text-cyan-accent" : "text-white")}>
                      {entry.name}
                    </p>
                    <p className="text-[9px] text-slate-500">{entry.xp.toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Check-In */}
          <div className="p-6 rounded-2xl glass-panel-neon border border-white/10 space-y-4 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-accent/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Daily Check-In</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in consecutively to earn bonus XP and unlock premium episodes.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-1.5 py-2 select-none">
              {[1, 2, 3, 4, 5].map((day) => (
                <div
                  key={day}
                  className={cn(
                    "p-2 rounded-lg border text-center text-xs font-bold",
                    day === 1 || (day === 2 && checkedIn)
                      ? "bg-gold-accent/20 border-gold-accent text-gold-accent"
                      : "bg-slate-950/60 border-white/5 text-slate-500"
                  )}
                >
                  <p className="text-[8px] text-slate-400">Day</p>
                  <p>{day}</p>
                </div>
              ))}
            </div>

            {!checkedIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full py-2.5 rounded-xl bg-gold-accent hover:bg-amber-500 text-xs font-bold text-slate-950 transition-colors cursor-pointer"
              >
                Check In Today (+10 XP)
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Checked In (+10 XP Claimed)
              </div>
            )}
          </div>

          {/* Points Balance */}
          <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">XP Balance</p>
              <h4 className="text-xl font-bold text-white flex items-center gap-1">
                <Star className="w-5 h-5 text-gold-accent fill-gold-accent" />
                {xp.toLocaleString()} pts
              </h4>
            </div>
            {!claimedReward ? (
              <button
                onClick={handleClaim}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-gold-accent/30 text-[10px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Claim VIP Badge
              </button>
            ) : (
              <span className="text-[10px] font-bold text-gold-accent bg-gold-accent/15 px-2 py-1 rounded">⭐ VIP Member</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
