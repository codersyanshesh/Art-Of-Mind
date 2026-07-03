import React from "react";
import { prisma } from "@/lib/prisma";
import CollectionsClient from "@/components/collections/CollectionsClient";

// Server Component — seeds collection preview slots with real published stories
export default async function CollectionsPage() {
  // Fetch enough stories to populate thumbnail previews
  const stories = await prisma.story.findMany({
    where: { isPublished: true, deletedAt: null },
    include: { universe: { select: { id: true } } },
    orderBy: { rating: "desc" },
    take: 8,
  });

  const storyPreviews = stories.map((s) => ({
    id: s.id,
    title: s.title,
    coverImage: s.coverImage,
    universeId: s.universe.id,
    type: s.type,
  }));

  return <CollectionsClient storyPreviews={storyPreviews} />;
}
