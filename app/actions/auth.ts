"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { SignUpSchema, SignInSchema } from "@/lib/validations";

/**
 * Signs up a new user, registering them in Supabase Auth and syncing a relational profile in Prisma.
 */
export async function signUpAction(formData: FormData) {
  const rawRole = formData.get("role") as string;

  // Zod validation
  const parsed = SignUpSchema.safeParse({
    displayName: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword") ?? formData.get("password"),
    role: rawRole === "CREATOR" ? "CREATOR" : "READER",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError.message };
  }

  const { email, password, displayName } = parsed.data;
  const role = parsed.data.role === "CREATOR" ? Role.CREATOR : Role.READER;

  try {
    // 0. Check if user already exists in Prisma to avoid database unique constraint crash
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { error: "An account with this email address already exists." };
    }

    const supabase = await createClient();

    // 1. Register with Supabase Auth (passing role metadata for middleware checks)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName,
          role,
        },
      },
    });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create authentication account." };
    }

    // 2. Create the associated App User, Profile, Wallet, and Preferences in Prisma
    await prisma.user.create({
      data: {
        supabaseId: authData.user.id,
        email: email.toLowerCase(),
        role,
        profile: {
          create: {
            displayName,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
          },
        },
        wallet: {
          create: {
            balance: 0.0,
          },
        },
        preferences: {
          create: {
            fontSize: "Medium",
            readingBg: "Dark",
          },
        },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Signup Action Error:", error);
    return { error: error.message || "An unexpected error occurred during signup." };
  }
}

/**
 * Retrieves the currently logged-in user profile from Prisma.
 */
export async function getCurrentUserProfileAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { user: null };

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        profile: true,
      },
    });

    if (!dbUser) return { user: null };

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.profile?.displayName || "Reader",
        role: dbUser.role,
        avatarUrl: dbUser.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbUser.email)}`,
      },
    };
  } catch (error: any) {
    console.error("getCurrentUserProfileAction Error:", error);
    return { user: null };
  }
}


/**
 * Signs in a user using credentials via Supabase Auth.
 */
export async function signInAction(formData: FormData) {
  // Zod validation
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    // Fetch the linked Prisma user record to verify everything is in sync
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: data.user.id },
      include: { profile: true },
    });

    return {
      success: true,
      user: {
        id: dbUser?.id || data.user.id,
        email: data.user.email,
        name: dbUser?.profile?.displayName || data.user.user_metadata?.displayName || "Reader",
        role: dbUser?.role || data.user.user_metadata?.role || "READER",
      },
    };
  } catch (error: any) {
    console.error("Signin Action Error:", error);
    return { error: error.message || "An unexpected error occurred during signin." };
  }
}

/**
 * Sends a real 6-digit OTP to the given email via Supabase Auth.
 * Called after successful password verification as a second authentication factor.
 */
export async function sendOtpAction(email: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Only send OTP to existing users — never create a new account from here
        shouldCreateUser: false,
      },
    });
    if (error) return { error: error.message };
    return { success: true };
  } catch (error: any) {
    console.error("Send OTP Action Error:", error);
    return { error: error.message || "Failed to send OTP code." };
  }
}

/**
 * Signs out the current user session.
 */
export async function signOutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Signout Action Error:", error);
    return { error: "Failed to sign out user." };
  }
}

/**
 * Retrieves the current user's notifications.
 */
export async function getNotificationsAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { notifications: [] };

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });
    if (!dbUser) return { notifications: [] };

    const notifications = await prisma.notification.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return { notifications };
  } catch (err) {
    console.error(err);
    return { notifications: [] };
  }
}

/**
 * Marks a notification as read.
 */
export async function markNotificationReadAction(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update notification." };
  }
}

