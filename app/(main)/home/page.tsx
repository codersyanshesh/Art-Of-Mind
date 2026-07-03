import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import HomeFeedContent from "@/components/feed/HomeFeedContent";

// Server Component — retrieves live database records
export default async function HomeFeed() {
  // 1. Get logged-in user from Supabase session
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Fetch active reading progress for this specific user
  let readingProgress: any[] = [];
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });
    if (dbUser) {
      readingProgress = await prisma.readingProgress.findMany({
        where: { userId: dbUser.id },
        include: { story: true },
        orderBy: { updatedAt: "desc" },
      });
    }
  }

  // 3. Fetch all published stories and details
  const stories = await prisma.story.findMany({
    where: { isPublished: true, deletedAt: null },
    include: { universe: true },
    orderBy: { rating: "desc" },
  });

  // 4. Fetch featured universe banner details
  const featuredUniverse = await prisma.universe.findFirst({
    include: { stories: true },
  });

  // 5. Fetch followed creators
  const creators = await prisma.user.findMany({
    where: { role: "CREATOR" },
    take: 3,
    include: { profile: true },
  });

  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-electric-violet" />
          Loading Feed...
        </div>
      }
    >
      <HomeFeedContent
        stories={stories}
        featuredUniverse={featuredUniverse}
        readingProgress={readingProgress}
        creators={creators}
      />
    </Suspense>
  );
}
