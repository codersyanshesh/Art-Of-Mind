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
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const user = data.user;
      const email = user.email!;
      const displayName = user.user_metadata?.full_name || user.user_metadata?.displayName || email.split("@")[0];

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

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // OAuth failed — send back to sign-in with an error flag
  return NextResponse.redirect(`${origin}/sign-in?error=oauth_callback_failed`);
}

