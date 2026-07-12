import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail, generateOtpCode } from "@/lib/email";

/**
 * Handles the OAuth callback from Google.
 * After syncing the Prisma user, generates and emails a 6-digit OTP code,
 * then redirects to the OTP verify page without signing out the Google session.
 * The OTP pending cookies are cleared and re-set on every new login attempt.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Always start with a clean slate — clear any leftover OTP cookies from previous sessions
  const clearResponse = (destination: string) => {
    const res = NextResponse.redirect(destination);
    res.cookies.delete("otp_email");
    res.cookies.delete("otp_pending");
    return res;
  };

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Exchange code error:", error);
        return clearResponse(`${origin}/sign-in?error=oauth_callback_failed&details=${encodeURIComponent(error.message)}`);
      }

      if (!data?.user) {
        return clearResponse(`${origin}/sign-in?error=oauth_callback_failed&details=No+user+session+returned`);
      }

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
        return clearResponse(`${origin}/sign-in?error=locked_out&hours=${hoursLeft}`);
      }

      // 2. Sync Prisma user record
      try {
        const existingUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              supabaseId: user.id,
              email: email.toLowerCase(),
              role: "READER",
              profile: {
                create: {
                  displayName,
                  avatarUrl: user.user_metadata?.avatar_url ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`,
                },
              },
              wallet: { create: { balance: 0.0 } },
              preferences: { create: { fontSize: "Medium", readingBg: "Dark" } },
            },
          });
        }
      } catch (dbError) {
        console.error("Prisma sync error during Google OAuth callback:", dbError);
      }

      // 3. Generate a fresh 6-digit OTP code and store in DB
      const otpCode = generateOtpCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await prisma.otpChallenge.upsert({
        where: { email: email.toLowerCase() },
        update: { code: otpCode, expiresAt, attempts: 0, lockedUntil: null },
        create: { email: email.toLowerCase(), code: otpCode, expiresAt, attempts: 0 },
      });

      // 4. Send the 6-digit OTP code to the user's Gmail
      try {
        await sendOtpEmail(email, otpCode);
      } catch (emailError: any) {
        console.error("OTP email send failed:", emailError);
        await supabase.auth.signOut();
        return clearResponse(`${origin}/sign-in?error=otp_send_failed&details=${encodeURIComponent(emailError.message || "Email delivery failed")}`);
      }

      // 5. Keep the Google session alive — redirect to OTP verification page
      const response = NextResponse.redirect(`${origin}/auth/verify-otp`);
      response.cookies.set("otp_email", email, { maxAge: 900, httpOnly: true, sameSite: "lax" });
      response.cookies.set("otp_pending", "true", { maxAge: 900, sameSite: "lax" });
      return response;

    } catch (err: any) {
      console.error("OAuth callback internal error:", err);
      return clearResponse(`${origin}/sign-in?error=oauth_callback_failed&details=${encodeURIComponent(err.message || "Internal Server Error")}`);
    }
  }

  return clearResponse(`${origin}/sign-in?error=oauth_callback_failed&details=No+authorization+code+provided`);
}
