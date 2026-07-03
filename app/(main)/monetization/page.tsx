import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import MonetizationContent from "@/components/monetization/MonetizationContent";

// Server Component — retrieves live wallet properties and ledgers
export default async function MonetizationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialBalance = 0.0;
  let transactions: any[] = [];

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        wallet: true,
      },
    });

    if (dbUser) {
      initialBalance = dbUser.wallet?.balance ?? 0.0;
      transactions = await prisma.transaction.findMany({
        where: { userId: dbUser.id },
        include: { story: true },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center gap-3 text-slate-400">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-electric-violet" />
          Loading Wallet...
        </div>
      }
    >
      <MonetizationContent initialBalance={initialBalance} transactions={transactions} />
    </Suspense>
  );
}
