import React from "react";
import Link from "next/link";
import { Star, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import ProfileHeaderClient from "@/components/profile/ProfileHeaderClient";

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

  if (!matched) {
    return (
      <div className="py-20 text-center text-slate-500">
        Profile not found.
      </div>
    );
  }

  // Get active authenticated user to check if this is their own profile page
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isOwnProfile = false;
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });
    if (dbUser && dbUser.id === matched.userId) {
      isOwnProfile = true;
    }
  }

  const isVerified = matched.user.role === "CREATOR" || matched.user.role === "ADMIN";

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
      {/* Profile Header Card with Facebook-style Cover Photo */}
      <ProfileHeaderClient
        profile={{
          id: matched.id,
          userId: matched.userId,
          displayName: matched.displayName,
          avatarUrl: matched.avatarUrl,
          coverUrl: matched.coverUrl,
          bio: matched.bio,
        }}
        isOwnProfile={isOwnProfile}
        isVerified={isVerified}
        storiesCount={stories.length}
      />

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
