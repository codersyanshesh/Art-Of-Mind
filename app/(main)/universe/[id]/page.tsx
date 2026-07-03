import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import UniverseHubContent from "@/components/universe/UniverseHubContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Server Component — retrieves live database records
export default async function UniverseHub({ params }: PageProps) {
  const resolvedParams = await params;
  const universeId = resolvedParams.id;

  // 1. Fetch Universe details
  let universe = await prisma.universe.findUnique({
    where: { id: universeId },
  });

  // Fallback to the first universe if the ID does not match (helps previewing)
  if (!universe) {
    universe = await prisma.universe.findFirst();
  }

  if (!universe) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Universe not found. Please run the seed script.
      </div>
    );
  }

  // 2. Fetch all published stories in this universe
  const stories = await prisma.story.findMany({
    where: { universeId: universe.id, isPublished: true, deletedAt: null },
    orderBy: { rating: "desc" },
  });

  // 3. Fetch characters in this universe
  const characters = await prisma.character.findMany({
    where: { universeId: universe.id },
    orderBy: { name: "asc" },
  });

  // 4. Fetch community comments on these stories
  const storyIds = stories.map((s) => s.id);
  const comments = await prisma.comment.findMany({
    where: { storyId: { in: storyIds }, parentCommentId: null, deletedAt: null },
    include: {
      user: {
        include: { profile: true },
      },
      replies: {
        where: { deletedAt: null },
        include: {
          user: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 5. Get current authenticated user details
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUserId: string | undefined;
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });
    if (dbUser) {
      currentUserId = dbUser.id;
    }
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-electric-violet" />
          Loading Universe Hub...
        </div>
      }
    >
      <UniverseHubContent
        universe={universe}
        stories={stories}
        characters={characters}
        comments={comments}
        currentUserId={currentUserId}
      />
    </Suspense>
  );
}
