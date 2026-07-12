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

/**
 * Verifies the 6-digit OTP code against the value stored in OtpChallenge.
 * Enforces a maximum of 3 attempts, locking the user out for 48 hours if they fail 3 times.
 * Does NOT call supabase.auth.verifyOtp — the Google session is kept alive from the OAuth callback.
 */
export async function verifyGoogleOtpAction(email: string, token: string) {
  const { cookies } = await import("next/headers");
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const challenge = await prisma.otpChallenge.findUnique({
      where: { email: normalizedEmail },
    });

    // 1. Check lockout
    if (challenge && challenge.lockedUntil && challenge.lockedUntil > new Date()) {
      const diffMs = challenge.lockedUntil.getTime() - Date.now();
      const hoursLeft = Math.ceil(diffMs / (1000 * 60 * 60));
      return { error: `Account locked. Please wait ${hoursLeft} hours to try again.` };
    }

    // 2. Check if challenge exists and code is not expired
    if (!challenge || !challenge.code) {
      return { error: "No verification code found. Please sign in again." };
    }

    if (challenge.expiresAt < new Date()) {
      return { error: "Verification code has expired. Please sign in with Google again." };
    }

    // 3. Compare code
    if (challenge.code !== token.trim()) {
      const currentAttempts = challenge.attempts + 1;
      const maxAttempts = 3;
      const remaining = maxAttempts - currentAttempts;

      if (currentAttempts >= maxAttempts) {
        const lockedUntil = new Date(Date.now() + 48 * 60 * 60 * 1000);
        await prisma.otpChallenge.update({
          where: { email: normalizedEmail },
          data: { attempts: currentAttempts, lockedUntil },
        });
        return { error: "Maximum attempts reached. Account locked for 48 hours.", locked: true };
      }

      await prisma.otpChallenge.update({
        where: { email: normalizedEmail },
        data: { attempts: currentAttempts },
      });

      return { error: `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` };
    }

    // 4. Correct code — clear challenge and OTP cookies
    await prisma.otpChallenge.delete({ where: { email: normalizedEmail } });

    const cookieStore = await cookies();
    cookieStore.delete("otp_email");
    cookieStore.delete("otp_pending");

    return { success: true };
  } catch (err: any) {
    console.error("Verify Google OTP Error:", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Resends a fresh 6-digit OTP code to the user's Gmail if they are not locked out.
 */
export async function resendGoogleOtpAction(email: string) {
  const { sendOtpEmail, generateOtpCode } = await import("@/lib/email");
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const challenge = await prisma.otpChallenge.findUnique({
      where: { email: normalizedEmail },
    });

    if (challenge && challenge.lockedUntil && challenge.lockedUntil > new Date()) {
      return { error: "Cannot resend. Account is currently locked." };
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.otpChallenge.upsert({
      where: { email: normalizedEmail },
      update: { code: otpCode, expiresAt, attempts: 0 },
      create: { email: normalizedEmail, code: otpCode, expiresAt, attempts: 0 },
    });

    await sendOtpEmail(email, otpCode);
    return { success: true };
  } catch (err: any) {
    console.error("Resend OTP Error:", err);
    return { error: err.message || "Failed to resend OTP code." };
  }
}


