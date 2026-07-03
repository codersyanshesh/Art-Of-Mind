"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Star, Trash2 } from "lucide-react";

interface BookmarkedStory {
  id: string;
  storyId: string;
  story: {
    id: string;
    title: string;
    coverImage: string;
    type: string;
    description: string | null;
    rating: number;
    universeId: string;
  };
}

interface BookmarksClientProps {
  initialItems: BookmarkedStory[];
}

export default function BookmarksClient({ initialItems }: BookmarksClientProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedStory[]>(initialItems);

  const removeBookmark = (id: string) => {
    // Local simulation of removing bookmark for responsiveness
    setBookmarks(bookmarks.filter((item) => item.id !== id));
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
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-electric-violet fill-electric-violet" />
          Bookmarked Items
        </h1>
        <p className="text-xs text-slate-400">
          Stories, series, and interactive games you have saved for later.
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((item) => (
            <Link
              key={item.id}
              href={`/universe/${item.story.universeId}/read`}
              className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-electric-violet/20 hover:bg-slate-900/40 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] transition-all duration-300 flex gap-4 group relative cursor-pointer"
            >
              <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-white/10">
                <img
                  src={item.story.coverImage}
                  alt={item.story.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {storyTypeLabel[item.story.type] ?? item.story.type}
                  </span>
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-electric-violet transition-colors">
                    {item.story.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {item.story.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-0.5 text-gold-accent font-semibold">
                    <Star className="w-3.5 h-3.5 fill-gold-accent text-gold-accent" />
                    {item.story.rating.toFixed(1)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeBookmark(item.id);
                    }}
                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors border-none cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 space-y-4">
          <Bookmark className="w-12 h-12 mx-auto text-slate-700" />
          <p className="text-sm">You haven&apos;t bookmarked any items yet.</p>
        </div>
      )}
    </div>
  );
}
