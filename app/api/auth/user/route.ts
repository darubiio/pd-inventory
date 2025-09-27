import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../../lib/auth/zohoAuth";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("zoho-session-id")?.value;

    const notAuthenticated = NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );

    if (!sessionId) return notAuthenticated;

    const redisSession = await zohoAuth.getSessionById(sessionId);
    const user = redisSession?.user;

    if (user) return NextResponse.json({ user });
    return notAuthenticated;
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
