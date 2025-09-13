import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../lib/auth/zohoAuth";

export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookie
    const sessionId = request.cookies.get("zoho-session-id")?.value;

    if (sessionId) {
      // Delete session from Redis
      await zohoAuth.deleteSessionById(sessionId);
      console.log("🗑️ Session deleted from Redis");
    }

    // Create redirect response and clear cookie
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("zoho-session-id");
    console.log("🍪 Session cookie cleared");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, redirect to home and clear cookie
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("zoho-session-id");
    return response;
  }
}
