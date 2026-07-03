"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { CommentSchema } from "@/lib/validations";

export async function createCommentAction(formData: FormData) {
  // Zod validation
  const parsed = CommentSchema.safeParse({
    storyId: formData.get("storyId"),
    text: formData.get("text"),
    spoiler: formData.get("spoiler") === "true",
    parentCommentId: formData.get("parentCommentId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { storyId, text, spoiler, parentCommentId } = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be signed in to post a comment." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return { error: "User profile not found in database." };
    }

    const newComment = await prisma.comment.create({
      data: {
        storyId,
        userId: dbUser.id,
        text,
        spoiler,
        parentCommentId: parentCommentId ?? null,
      },
    });

    revalidatePath(`/universe/[id]`, "page");
    return { success: true, commentId: newComment.id };
  } catch (error: any) {
    console.error("Create Comment Action Error:", error);
    return { error: error.message || "Failed to post comment." };
  }
}
