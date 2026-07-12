import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import SearchResultsContent from "@/components/search/SearchResultsContent";

// Server Component — fetches all stories from database
export default async function SearchPage() {
  const stories = await prisma.story.findMany({
    where: { deletedAt: null },
    include: { universe: true },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="space-y-6 pb-16">
      <Suspense
        fallback={
          <div className="py-20 flex items-center justify-center gap-3 text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-electric-violet" />
            Searching...
          </div>
        }
      >
        <SearchResultsContent stories={stories} />
      </Suspense>
    </div>
  );
}
