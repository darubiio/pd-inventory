import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../../lib/auth/zohoAuth";

const getUserData = async (sessionId: string) => {
  const session = await zohoAuth.getSessionById(sessionId);

  return {
    ...session?.user,
    is_admin: session?.user?.user_role === "admin",
  };
};

export async function GET(request: NextRequest) {
  try {
    const sessionId =
      request.cookies.get("zoho-session-id")?.value ||
      request.headers.get("x-session-id");

    const notAuthenticated = NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );

    if (!sessionId) return notAuthenticated;

    const userData = await getUserData(sessionId);
    if (!userData) return notAuthenticated;

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
