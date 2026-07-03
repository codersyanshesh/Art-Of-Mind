import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import SideBySideReaderClient from "@/components/universe/SideBySideReaderClient";
import { redirect } from "next/navigation";
import { StoryType } from "@prisma/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UniverseReaderPage({ params }: PageProps) {
  const resolvedParams = await params;
  const universeId = resolvedParams.id;

  // 1. Fetch Universe details
  let universe = await prisma.universe.findUnique({
    where: { id: universeId },
  });

  // Fallback to first universe if the ID does not match (helps previewing/direct entry)
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

  // 2. Fetch the primary Novel in this universe
  const novel = await prisma.story.findFirst({
    where: {
      universeId: universe.id,
      type: StoryType.NOVEL,
      isPublished: true,
      deletedAt: null,
    },
    include: {
      chapters: {
        where: { deletedAt: null },
        orderBy: { index: "asc" },
      },
    },
  });

  if (!novel) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm bg-slate-950 min-h-screen flex items-center justify-center">
        No novel works published in this universe yet.
      </div>
    );
  }

  // 3. Fetch Reels (episodes) in this universe
  const reelStories = await prisma.story.findMany({
    where: {
      universeId: universe.id,
      type: StoryType.REEL,
      isPublished: true,
      deletedAt: null,
    },
    include: {
      mediaAssets: true,
    },
  });

  // Map database reel stories + mediaAssets to display episodes format
  const episodes = reelStories.flatMap((story) => {
    if (story.mediaAssets.length === 0) {
      return [
        {
          id: story.id,
          title: story.title,
          duration: "1:30",
          description: story.description || "",
          coverImage: story.coverImage,
        },
      ];
    }
    return story.mediaAssets.map((asset) => ({
      id: asset.id,
      title: story.title,
      duration: asset.duration 
        ? `${Math.floor(asset.duration / 60)}:${Math.floor(asset.duration % 60).toString().padStart(2, "0")}`
        : "1:30",
      description: story.description || "",
      coverImage: story.coverImage,
    }));
  });

  // 4. Get active user and their saved reading progress
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialChapterIndex = 0;
  let initialPercent = 0;

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (dbUser) {
      const progress = await prisma.readingProgress.findUnique({
        where: {
          userId_storyId: {
            userId: dbUser.id,
            storyId: novel.id,
          },
        },
      });

      if (progress) {
        initialChapterIndex = progress.chapterIndex;
        initialPercent = progress.percent;
      }
    }
  }

  // Map database chapters to Chapter interface format
  const mappedChapters = novel.chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    content: ch.content,
    index: ch.index,
  }));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-electric-violet" />
          Loading Reader...
        </div>
      }
    >
      <SideBySideReaderClient
        universe={{
          id: universe.id,
          name: universe.name,
          description: universe.description,
        }}
        storyId={novel.id}
        chapters={mappedChapters}
        episodes={episodes}
        initialChapterIndex={initialChapterIndex}
        initialPercent={initialPercent}
      />
    </Suspense>
  );
}
