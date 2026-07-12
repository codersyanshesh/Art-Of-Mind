import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Retrieve user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Enforce OTP challenge redirect if OTP flow is active
  const otpPending = request.cookies.get("otp_pending")?.value === "true";
  if (otpPending && !path.startsWith("/auth/verify-otp") && !path.startsWith("/auth/callback")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/verify-otp";
    return NextResponse.redirect(url);
  }

  // 1. Redirect unauthenticated users away from app routes
  const isProtectedRoute =
    path.startsWith("/home") ||
    path.startsWith("/discover") ||
    path.startsWith("/trending") ||
    path.startsWith("/categories") ||
    path.startsWith("/search") ||
    path.startsWith("/studio") ||
    path.startsWith("/settings") ||
    path.startsWith("/universe") ||
    path.startsWith("/monetization") ||
    path.startsWith("/achievements");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // 2. Redirect authenticated users away from auth pages
  const isAuthRoute =
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up") ||
    path.startsWith("/forgot-password");

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // 3. RBAC Route Protection: /studio (Creator Workspace) is only accessible by CREATOR, MODERATOR, ADMIN
  if (user && path.startsWith("/studio")) {
    const role = user.user_metadata?.role;
    if (role === "READER" || !role) {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
