import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OtpVerifyClient from "@/components/auth/OtpVerifyClient";

export default async function VerifyOtpPage() {
  const cookieStore = await cookies();
  const pending = cookieStore.get("otp_pending")?.value;
  const email = cookieStore.get("otp_email")?.value;

  // If no OTP flow is active, send them back to sign-in
  if (pending !== "true" || !email) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Immersive background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.05),transparent_50%)] pointer-events-none" />

      <OtpVerifyClient initialEmail={email} />
    </div>
  );
}
