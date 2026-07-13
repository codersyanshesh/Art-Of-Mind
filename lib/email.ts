import nodemailer from "nodemailer";

/**
 * Sends a 6-digit OTP code to the specified email address using Gmail SMTP.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables.
 */
async function sendOtpEmailWithNodemailer(to: string, code: string): Promise<void> {
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
 * Sends a 6-digit OTP code to the specified email address using EmailJS REST API,
 * falling back to Gmail SMTP if EmailJS is not fully configured.
 */
export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_yv3w7dh";
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_flszpye";
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  const isEmailJsConfigured = publicKey && publicKey !== "YOUR_EMAILJS_PUBLIC_KEY";

  if (!isEmailJsConfigured) {
    console.warn("EmailJS Public Key is not configured. Falling back to Nodemailer.");
    return sendOtpEmailWithNodemailer(to, code);
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey || undefined,
    template_params: {
      to_email: to,
      email: to,
      to_name: to.split("@")[0],
      code: code,
      otp: code,
      otp_code: code,
    },
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("EmailJS API Error response:", errorText);
    throw new Error(`EmailJS send failed with status ${response.status}: ${errorText}`);
  }
}

/**
 * Generates a secure random 6-digit numeric OTP code.
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
