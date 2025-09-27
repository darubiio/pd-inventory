import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../../lib/auth/zohoAuth";
import { ZohoUser } from "../../../../types/zoho";

export async function GET(request: NextRequest) {
  try {
    console.log("🧑‍💼 USER PROFILE API: Starting user profile request");

    const sessionId = request.headers.get("x-session-id");
    console.log(
      "🍪 Session ID from header:",
      sessionId ? `${sessionId.substring(0, 10)}...` : "NOT FOUND"
    );

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const session = await zohoAuth.getSessionById(sessionId);
    console.log(
      "📦 Session from Redis:",
      session ? `Found for user: ${session.user?.name}` : "NOT FOUND"
    );

    if (!session) {
      return NextResponse.json(
        { error: "Session not found or expired" },
        { status: 401 }
      );
    }

    const userProfile: ZohoUser = session.user;

    console.log("✅ Returning user profile:", userProfile);
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json(
      { error: "Failed to get user profile" },
      { status: 500 }
    );
  }
}
