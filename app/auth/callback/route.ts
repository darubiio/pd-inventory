import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../lib/auth/zohoAuth";

export async function GET(request: NextRequest) {
  console.log("🔄 Callback started");

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  console.log("📥 Callback received:", {
    hasCode: !!code,
    codePrefix: code ? code.substring(0, 20) : null,
    state,
    error,
  });

  if (error) {
    console.error("❌ OAuth error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  if (!code) {
    console.error("❌ No authorization code received");
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  try {
    const { sessionId, returnTo } = await zohoAuth.processCallback(code, state);

    const response = NextResponse.redirect(new URL(returnTo, request.url));

    response.cookies.set("zoho-session-id", sessionId, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    console.log(
      "🍪 Session ID cookie set:",
      sessionId.substring(0, 20) + "..."
    );
    console.log("🚀 Redirect response created");

    return response;
  } catch (error) {
    console.error("💥 Callback error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
