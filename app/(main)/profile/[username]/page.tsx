import React from "react";
import Link from "next/link";
import { Star, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

// Server Component — look up creator profile from DB by username slug
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Match by normalised displayName (lower-cased, spaces removed)
  const profiles = await prisma.profile.findMany({
    include: {
      user: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });

  const matched = profiles.find(
    (p) =>
      p.displayName.toLowerCase().replace(/\s+/g, "") ===
      username?.toLowerCase()
  );

  const creatorName = matched?.displayName ?? "C.R. Nexus";
  const creatorAvatar =
    matched?.avatarUrl ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=7c3aed&color=fff&size=128`;
  const creatorBio =
    matched?.bio ?? "Award-winning creator of the Crimson Throne universe.";
  const isVerified = matched?.user.role === "CREATOR" || matched?.user.role === "ADMIN";

  // Fetch all published stories and resolve them to this creator's universe
  const stories = await prisma.story.findMany({
    where: { isPublished: true, deletedAt: null },
    include: { universe: { select: { id: true, name: true } } },
    orderBy: { rating: "desc" },
    take: 6,
  });

  const storyTypeLabel: Record<string, string> = {
    NOVEL: "Novel",
    REEL: "Vertical Series",
    AUDIO: "Audio Book",
    COMIC: "Comic",
    INTERACTIVE: "Interactive",
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header Card */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-neon border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-electric-violet/40 shrink-0 relative z-10">
          <img src={creatorAvatar} alt={creatorName} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-4 relative z-10 flex-1">
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-black text-white">{creatorName}</h2>
              {isVerified && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-electric-violet/20 border border-electric-violet/30 text-glow-purple text-[8px] font-bold text-electric-violet uppercase tracking-wider w-max mx-auto md:mx-0">
                  Verified Creator
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-xl">{creatorBio}</p>
          </div>

          <div className="flex justify-center md:justify-start gap-6 text-xs text-slate-400">
            <div>
              <span className="font-bold text-white">{stories.length}K</span> Followers
            </div>
            <div>
              <span className="font-bold text-white">{Math.ceil(stories.length / 2)}</span> Following
            </div>
          </div>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white relative z-10 shadow-lg shadow-electric-violet/20 transition-colors cursor-pointer">
          Follow Creator
        </button>
      </div>

      {/* Published Works Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-electric-violet" />
          Works Published ({stories.length})
        </h3>

        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/universe/${story.universe.id}`}
                className="group rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-electric-violet/30 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] transition-all flex flex-col h-full cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 text-[9px] font-bold text-slate-300">
                    {storyTypeLabel[story.type] ?? story.type}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-electric-violet transition-colors truncate">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{story.description ?? ""}</p>
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
        ) : (
          <p className="text-sm text-slate-500 py-6">No works published yet.</p>
        )}
      </div>
    </div>
  );
}
