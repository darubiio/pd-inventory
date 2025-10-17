import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { zohoAuth } from "./lib/auth/zohoAuth";
import { isAuth, isPublic } from "./lib/api/utils/pathUtils";

export async function middleware(request: NextRequest) {
  const {
    url,
    nextUrl: { pathname, search },
  } = request;

  console.log("🛡️ Middleware checking:", pathname);

  if (isAuth(pathname) || isPublic(pathname)) {
    console.log("✅ Auth/public route, allowing through:", pathname);
    return NextResponse.next();
  }

  const publicApiRoutes = ["/api/auth/"];

  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicApiRoute) {
    console.log("✅ Public API route, allowing through:", pathname);
    return NextResponse.next();
  }

  const sessionId = request.cookies.get("zoho-session-id")?.value;
  console.log(
    "🍪 Session ID from cookie:",
    sessionId ? sessionId.substring(0, 20) + "..." : "NOT FOUND"
  );

  if (!sessionId) {
    console.log("❌ No session ID found");

    // For API routes, return 401 instead of redirect
    if (pathname.startsWith("/api/")) {
      console.log("❌ API route without session, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For pages, redirect to login
    console.log("❌ Page route without session, redirecting to login");
    const { origin } = new URL(url);
    const returnTo = encodeURIComponent(pathname + search);
    return NextResponse.redirect(`${origin}/auth/login?returnTo=${returnTo}`);
  }

  // Get session from Redis using session ID
  const session = await zohoAuth.getSessionById(sessionId);

  if (!session) {
    console.log("❌ No valid session found");

    // For API routes, return 401 instead of redirect
    if (pathname.startsWith("/api/")) {
      console.log("❌ API route with invalid session, returning 401");
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // For pages, redirect to login and clear invalid cookie
    console.log("❌ Page route with invalid session, redirecting to login");
    const { origin } = new URL(url);
    const returnTo = encodeURIComponent(pathname + search);

    const response = NextResponse.redirect(
      `${origin}/auth/login?returnTo=${returnTo}`
    );
    response.cookies.delete("zoho-session-id");
    return response;
  }

  console.log("✅ Session found for user:", session.user.name);

  // Add user info and session ID to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-session-id", sessionId); // Add session ID for getUserAuth
  requestHeaders.set("x-user-id", session.user.user_id);
  requestHeaders.set("x-user-email", session.user.email_ids[0]?.email || "");
  requestHeaders.set("x-user-name", session.user.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp).*)",
  ],
};
