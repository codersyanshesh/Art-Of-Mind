import nodemailer from "nodemailer";

/**
 * Sends a 6-digit OTP code to the specified email address using Gmail SMTP.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables.
 */
export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD environment variable is missing.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Art of Mind" <${user}>`,
    to,
    subject: "Your Art of Mind Verification Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f1a;color:#fff;border-radius:16px;">
        <h1 style="font-size:24px;font-weight:900;color:#7c3aed;margin-bottom:8px;">🔒 Verify Your Identity</h1>
        <p style="color:#94a3b8;margin-bottom:24px;">Enter this 6-digit code on the Art of Mind verification screen. It expires in <strong>15 minutes</strong>.</p>
        <div style="font-size:40px;font-weight:900;letter-spacing:12px;background:#1e1b4b;padding:20px;border-radius:12px;text-align:center;color:#a78bfa;">
          ${code}
        </div>
        <p style="color:#475569;font-size:12px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

/**
 * Generates a secure random 6-digit numeric OTP code.
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
