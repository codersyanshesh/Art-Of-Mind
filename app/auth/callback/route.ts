import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Handles the OAuth callback from Google (and any future OAuth providers).
 * Supabase redirects here after the user grants permission in Google's account picker.
 * We exchange the one-time `code` for a valid session, ensure their Prisma profile is synced, and redirect into the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const user = data.user;
      const email = user.email!;
      const displayName = user.user_metadata?.full_name || user.user_metadata?.displayName || email.split("@")[0];

      // 1. Check if the user is locked out
      const challenge = await prisma.otpChallenge.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (challenge && challenge.lockedUntil && challenge.lockedUntil > new Date()) {
        await supabase.auth.signOut();
        const diffMs = challenge.lockedUntil.getTime() - Date.now();
        const hoursLeft = Math.ceil(diffMs / (1000 * 60 * 60));
        return NextResponse.redirect(`${origin}/sign-in?error=locked_out&hours=${hoursLeft}`);
      }

      try {
        // Ensure the Prisma User, Profile, Wallet, and Preferences records exist
        const existingUser = await prisma.user.findUnique({
          where: { supabaseId: user.id },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              supabaseId: user.id,
              email: email.toLowerCase(),
              role: "READER", // default role for Google OAuth signup
              profile: {
                create: {
                  displayName,
                  avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
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
        }
      } catch (dbError) {
        console.error("Prisma Sync during Google OAuth Callback failed:", dbError);
      }

      // 2. Initialize or reset OTP challenge (attempts: 0)
      await prisma.otpChallenge.upsert({
        where: { email: email.toLowerCase() },
        update: { attempts: 0, lockedUntil: null },
        create: { email: email.toLowerCase(), attempts: 0, lockedUntil: null },
      });

      // 3. Trigger sending OTP code to email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      // 4. Sign out the temporary OAuth session so they cannot access home pages until OTP verification is complete
      await supabase.auth.signOut();

      if (otpError) {
        console.error("OTP send failed:", otpError);
        return NextResponse.redirect(`${origin}/sign-in?error=otp_send_failed`);
      }

      // 5. Redirect to OTP verification page and set temporary cookies
      const response = NextResponse.redirect(`${origin}/auth/verify-otp`);
      response.cookies.set("otp_email", email, { maxAge: 900, httpOnly: true });
      response.cookies.set("otp_pending", "true", { maxAge: 900 });
      return response;
    }
  }

  // OAuth failed — send back to sign-in with an error flag
  return NextResponse.redirect(`${origin}/sign-in?error=oauth_callback_failed`);
}

