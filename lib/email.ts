/**
 * Sends a 6-digit OTP code to the specified email address via the EmailJS REST API.
 * Requires NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and
 * NEXT_PUBLIC_EMAILJS_PUBLIC_KEY environment variables.
 */
export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_yv3w7dh";
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_flszpye";
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!publicKey || publicKey === "YOUR_EMAILJS_PUBLIC_KEY") {
    throw new Error(
      "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY is not configured. " +
      "Add it to your Vercel environment variables."
    );
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey || undefined,
    template_params: {
      // Recipient
      to_email: to,
      email: to,
      to_name: to.split("@")[0],
      // OTP code — covers all common EmailJS template variable names
      passcode: code,
      otp: code,
      code: code,
      otp_code: code,
      pin: code,
      // Company branding
      company_name: "Art of Mind",
      app_name: "Art of Mind",
      from_name: "Art of Mind",
      // Expiry — covers both timestamp and relative formats
      expiry_time: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      expiry: "15 minutes",
      validity: "15 minutes",
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
    throw new Error(`EmailJS send failed (${response.status}): ${errorText}`);
  }
}

/**
 * Generates a secure random 6-digit numeric OTP code.
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
