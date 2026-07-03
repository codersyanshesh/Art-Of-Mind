import React from "react";
import Link from "next/link";
import { Flame, Eye, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

const storyTypeLabel: Record<string, string> = {
  NOVEL: "Novel",
  REEL: "Vertical Series",
  AUDIO: "Audio Book",
  COMIC: "Comic",
  INTERACTIVE: "Interactive",
};

// Server Component — sorts stories by rating from the live database
export default async function TrendingPage() {
  const stories = await prisma.story.findMany({
    where: { isPublished: true, deletedAt: null },
    include: {
      universe: true,
      _count: { select: { readingProgress: true } },
    },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <Flame className="w-7 h-7 text-rose-500 animate-bounce" />
          Trending Now
        </h1>
        <p className="text-xs text-slate-400">
          The most viewed and read creations across all media formats.
        </p>
      </div>

      <div className="space-y-4">
        {stories.map((story, index) => (
          <Link
            key={story.id}
            href={`/universe/${story.universeId}`}
            className="flex gap-4 p-4 rounded-2xl glass-panel border border-white/5 hover:border-white/20 hover:scale-[1.005] hover:shadow-lg active:scale-[0.995] transition-all items-center cursor-pointer"
          >
            {/* Rank */}
            <div className="text-xl md:text-3xl font-black text-slate-700 w-8 text-center shrink-0">
              #{index + 1}
            </div>

            {/* Cover */}
            <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10">
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400">
                {storyTypeLabel[story.type] ?? story.type}
              </span>
              <h3 className="font-bold text-sm text-white truncate">{story.title}</h3>
              <div className="flex items-center gap-4 text-[10px] text-slate-500">
                <span>{story.universe.name}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {story._count.readingProgress}K readers
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-gold-accent font-black text-sm shrink-0">
              <Star className="w-4 h-4 fill-gold-accent" />
              {story.rating.toFixed(1)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
