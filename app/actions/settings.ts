"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ProfileSchema, PreferencesSchema, ReadingProgressSchema } from "@/lib/validations";

/**
 * Saves the current user's display name and bio to the Profile table.
 */
export async function updateProfileAction(formData: FormData) {
  const parsed = ProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    bio: formData.get("bio") ?? undefined,
    avatarUrl: formData.get("avatarUrl") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return { error: "User not found." };

    await prisma.profile.upsert({
      where: { userId: dbUser.id },
      update: {
        displayName: parsed.data.displayName,
        bio: parsed.data.bio ?? null,
        avatarUrl: parsed.data.avatarUrl || null,
      },
      create: {
        userId: dbUser.id,
        displayName: parsed.data.displayName,
        bio: parsed.data.bio ?? null,
        avatarUrl: parsed.data.avatarUrl || null,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Update Profile Error:", err);
    return { error: err.message || "Failed to save profile." };
  }
}

/**
 * Persists the current user's accessibility preferences to the Preferences table.
 */
export async function updatePreferencesAction(formData: FormData) {
  const parsed = PreferencesSchema.safeParse({
    fontSize: formData.get("fontSize"),
    dyslexiaFont: formData.get("dyslexiaFont") === "true",
    readingBg: formData.get("readingBg"),
    colorblindMode: formData.get("colorblindMode") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return { error: "User not found." };

    await prisma.preferences.upsert({
      where: { userId: dbUser.id },
      update: { ...parsed.data },
      create: { userId: dbUser.id, ...parsed.data },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Update Preferences Error:", err);
    return { error: err.message || "Failed to save preferences." };
  }
}

/**
 * Upserts the reading progress for the current user on a given story.
 */
export async function saveReadingProgressAction(formData: FormData) {
  const parsed = ReadingProgressSchema.safeParse({
    storyId: formData.get("storyId"),
    chapterIndex: Number(formData.get("chapterIndex")),
    percent: Number(formData.get("percent") ?? 0),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated." };

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return { error: "User not found." };

    await prisma.readingProgress.upsert({
      where: { userId_storyId: { userId: dbUser.id, storyId: parsed.data.storyId } },
      update: {
        chapterIndex: parsed.data.chapterIndex,
        percent: parsed.data.percent,
      },
      create: {
        userId: dbUser.id,
        storyId: parsed.data.storyId,
        chapterIndex: parsed.data.chapterIndex,
        percent: parsed.data.percent,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Save Reading Progress Error:", err);
    return { error: err.message || "Failed to save reading progress." };
  }
}
