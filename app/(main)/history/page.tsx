import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import HistoryClient from "@/components/history/HistoryClient";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  let historyItems: any[] = [];

  if (dbUser) {
    const progressList = await prisma.readingProgress.findMany({
      where: { userId: dbUser.id },
      include: {
        story: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    historyItems = progressList.map((item) => ({
      id: item.id,
      storyId: item.storyId,
      chapterIndex: item.chapterIndex,
      percent: item.percent,
      updatedAt: item.updatedAt.toISOString(),
      story: {
        id: item.story.id,
        title: item.story.title,
        coverImage: item.story.coverImage,
        type: item.story.type,
        universeId: item.story.universeId,
      },
    }));
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-electric-violet" />
          Loading History...
        </div>
      }
    >
      <HistoryClient initialItems={historyItems} />
    </Suspense>
  );
}
