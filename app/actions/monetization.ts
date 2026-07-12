"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Adds points to the currently authenticated user's wallet in the database.
 */
export async function buyPointsAction(points: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { wallet: true },
    });

    if (!dbUser) return { error: "User not found." };

    // 1. Update user's wallet balance
    const updatedWallet = await prisma.wallet.upsert({
      where: { userId: dbUser.id },
      update: { balance: { increment: points } },
      create: { userId: dbUser.id, balance: points },
    });

    // 2. Record the transaction
    await prisma.transaction.create({
      data: {
        userId: dbUser.id,
        amount: points,
        type: "Point Purchase",
      },
    });

    revalidatePath("/monetization");
    return { success: true, balance: updatedWallet.balance };
  } catch (error: any) {
    console.error("Buy Points Error:", error);
    return { error: error.message || "Failed to purchase points." };
  }
}

/**
 * Deducts points from user's wallet and credits selected creator's wallet in the database.
 */
export async function tipCreatorAction(creatorId: string, points: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    // Get tipping user
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: { wallet: true },
    });
    if (!dbUser) return { error: "User not found." };

    const userBalance = dbUser.wallet?.balance ?? 0;
    if (userBalance < points) {
      return { error: "Insufficient points balance." };
    }

    // Get receiving creator
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
      include: { profile: true },
    });
    if (!creator) return { error: "Creator not found." };

    // 1. Deduct points from user's wallet
    const userWallet = await prisma.wallet.update({
      where: { userId: dbUser.id },
      data: { balance: { decrement: points } },
    });

    // 2. Credit points to creator's wallet
    await prisma.wallet.upsert({
      where: { userId: creator.id },
      update: { balance: { increment: points } },
      create: { userId: creator.id, balance: points },
    });

    // 3. Record transactions
    // Negative ledger for the user
    await prisma.transaction.create({
      data: {
        userId: dbUser.id,
        amount: -points,
        type: "Tip Deduct",
      },
    });

    // Positive ledger for the creator
    await prisma.transaction.create({
      data: {
        userId: creator.id,
        amount: points,
        type: "Tip Earn",
      },
    });

    revalidatePath("/monetization");
    return { success: true, balance: userWallet.balance };
  } catch (error: any) {
    console.error("Tip Creator Error:", error);
    return { error: error.message || "Failed to submit tip." };
  }
}
