import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../../lib/auth/zohoAuth";
import {
  refreshTokenIfNeeded,
  getTokenExpiryInfo,
} from "../../../../lib/auth/tokenRefreshManager";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("zoho-session-id")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const session = await zohoAuth.getSessionById(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const expiryInfo = await getTokenExpiryInfo(session);

    if (expiryInfo.isExpired) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    if (expiryInfo.needsRefresh && session.refresh_token) {
      try {
        const updatedSession = await refreshTokenIfNeeded(sessionId, session);

        return NextResponse.json({
          success: true,
          expires_at: updatedSession.expires_at,
          expires_in_seconds: Math.floor(
            (updatedSession.expires_at - Date.now()) / 1000
          ),
          refreshed: true,
        });
      } catch (error) {
        console.error("❌ Failed to refresh token in background:", error);
        return NextResponse.json(
          { error: "Failed to refresh token" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      expires_at: session.expires_at,
      expires_in_seconds: expiryInfo.expiresInSeconds,
      refreshed: false,
    });
  } catch (error) {
    console.error("💥 Refresh endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
