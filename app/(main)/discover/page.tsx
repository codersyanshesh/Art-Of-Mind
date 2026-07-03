import React from "react";
import Link from "next/link";
import { Star, Compass } from "lucide-react";
import { prisma } from "@/lib/prisma";

// Server Component — reads directly from the database
export default async function DiscoverPage() {
  const stories = await prisma.story.findMany({
    where: { isPublished: true, deletedAt: null },
    include: {
      universe: { select: { id: true, name: true } },
    },
    orderBy: { rating: "desc" },
  });

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
          <Compass className="w-7 h-7 text-cyan-accent" />
          Discover All Formats
        </h1>
        <p className="text-xs text-slate-400">
          Browse our entire library of novels, vertical series, comics, and audiobooks.
        </p>
      </div>

      {stories.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-12">
          No published stories yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/universe/${story.universe.id}`}
              className="group rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-cyan-accent/30 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] transition-all flex flex-col h-full cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 text-[9px] font-bold text-slate-300">
                  {storyTypeLabel[story.type] ?? story.type}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-accent transition-colors truncate">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {story.description ?? ""}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <span className="truncate max-w-[60%]">{story.universe.name}</span>
                  <span className="flex items-center gap-0.5 text-gold-accent font-bold">
                    <Star className="w-3 h-3 fill-gold-accent" />
                    {story.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
