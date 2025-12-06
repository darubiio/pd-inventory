import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../lib/auth/zohoAuth";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("zoho-session-id")?.value;

    if (sessionId) {
      await zohoAuth.deleteSessionById(sessionId);
      console.log("🗑️ Session deleted from Redis and token revoked");
    }

    const response = NextResponse.redirect(
      new URL("/auth/login?force_consent=true", request.url)
    );
    response.cookies.delete("zoho-session-id");
    console.log("🍪 Session cookie cleared, redirecting to force consent");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.redirect(
      new URL("/auth/login?force_consent=true", request.url)
    );
    response.cookies.delete("zoho-session-id");
    return response;
  }
}
