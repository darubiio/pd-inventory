import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../../lib/auth/zohoAuth";
import { ZohoUser } from "../../../../types/zoho";
import { UserProfile } from "../../../../types/user";

export async function GET(request: NextRequest) {
  try {
    console.log("🧑‍💼 USER PROFILE API: Starting user profile request");

    // Obtener el session ID del header (inyectado por middleware)
    const sessionId = request.headers.get("x-session-id");
    console.log(
      "🍪 Session ID from header:",
      sessionId ? `${sessionId.substring(0, 10)}...` : "NOT FOUND"
    );

    if (!sessionId) {
      console.log("❌ No session ID found in headers");
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Obtener la sesión desde Redis
    const session = await zohoAuth.getSessionById(sessionId);
    console.log(
      "📦 Session from Redis:",
      session ? `Found for user: ${session.user?.name}` : "NOT FOUND"
    );

    if (!session) {
      console.log("❌ Session not found or expired in Redis");
      return NextResponse.json(
        { error: "Session not found or expired" },
        { status: 401 }
      );
    }

    // Extraer la información del usuario de la sesión
    const userProfile: ZohoUser = session.user;
    console.log("👤 User profile from session:", {
      name: userProfile.name,
      email: userProfile.email_ids?.[0]?.email,
      photo_url: userProfile.photo_url,
    });

    // Obtener el email principal
    const primaryEmail =
      userProfile.email_ids?.find((email: { email: string; is_selected: boolean }) => email.is_selected)?.email ||
      userProfile.email_ids?.[0]?.email ||
      "";

    // Retornar la información del usuario
    const userProfileResponse: UserProfile = {
      user_id: userProfile.user_id,
      name: userProfile.name,
      email: primaryEmail,
      photo_url: userProfile.photo_url,
      user_role: userProfile.user_role,
      user_type: userProfile.user_type,
      status: userProfile.status,
    };

    console.log("✅ Returning user profile:", userProfileResponse);
    return NextResponse.json(userProfileResponse);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json(
      { error: "Failed to get user profile" },
      { status: 500 }
    );
  }
}
