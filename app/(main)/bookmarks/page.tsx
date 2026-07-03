import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import BookmarksClient from "@/components/bookmarks/BookmarksClient";
import { redirect } from "next/navigation";

export default async function BookmarksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  let bookmarks: any[] = [];

  if (dbUser) {
    // Treat active reading progress entries as bookmarks/reading list
    const progressList = await prisma.readingProgress.findMany({
      where: { userId: dbUser.id },
      include: {
        story: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    bookmarks = progressList.map((item) => ({
      id: item.id,
      storyId: item.storyId,
      story: {
        id: item.story.id,
        title: item.story.title,
        coverImage: item.story.coverImage,
        type: item.story.type,
        description: item.story.description,
        rating: item.story.rating,
        universeId: item.story.universeId,
      },
    }));
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-electric-violet" />
          Loading Bookmarks...
        </div>
      }
    >
      <BookmarksClient initialItems={bookmarks} />
    </Suspense>
  );
}
