"use client";

import React, { useState } from "react";
import Link from "next/link";
import { History, Play, BookOpen, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  storyId: string;
  chapterIndex: number;
  percent: number;
  updatedAt: string;
  story: {
    id: string;
    title: string;
    coverImage: string;
    type: string;
    universeId: string;
  };
}

interface HistoryClientProps {
  initialItems: HistoryItem[];
}

export default function HistoryClient({ initialItems }: HistoryClientProps) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(initialItems);

  const clearItem = (id: string) => {
    setHistoryItems(historyItems.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setHistoryItems([]);
  };

  const storyTypeLabel: Record<string, string> = {
    NOVEL: "Novel",
    REEL: "Vertical Series",
    AUDIO: "Audio Book",
    COMIC: "Comic",
    INTERACTIVE: "Interactive",
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <History className="w-7 h-7 text-electric-violet" />
            Viewing &amp; Reading History
          </h1>
          <p className="text-xs text-slate-400">
            Resume reading novels, watching vertical series, or listening to audios.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer border-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All History
          </button>
        )}
      </div>

      {historyItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {historyItems.map((item) => (
            <Link
              key={item.id}
              href={`/universe/${item.story.universeId}/read`}
              className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-electric-violet/30 hover:bg-slate-900/40 hover:shadow-lg hover:shadow-electric-violet/10 transition-all duration-300 flex gap-4 group relative cursor-pointer"
            >
              <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                <img
                  src={item.story.coverImage}
                  alt={item.story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.story.type === "REEL" ? (
                    <Play className="w-8 h-8 fill-cyan-accent text-cyan-accent drop-shadow-lg" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-electric-violet drop-shadow-lg" />
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {storyTypeLabel[item.story.type] ?? item.story.type}
                  </span>
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-electric-violet transition-colors">
                    {item.story.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium truncate">
                    Chapter Index {item.chapterIndex + 1}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Progress: <span className="text-slate-300 font-semibold">{item.percent}%</span>
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <span>Last active: {new Date(item.updatedAt).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      clearItem(item.id);
                    }}
                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors border-none cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5 text-electric-violet" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 space-y-4">
          <History className="w-12 h-12 mx-auto text-slate-700" />
          <p className="text-sm">You haven&apos;t read or watched anything yet.</p>
        </div>
      )}
    </div>
  );
}
