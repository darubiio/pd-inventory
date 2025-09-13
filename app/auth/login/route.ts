import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../lib/auth/zohoAuth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo");

  // Generate state parameter for OAuth
  const state = returnTo ? Buffer.from(returnTo).toString("base64") : undefined;

  // Get authorization URL
  const authUrl = zohoAuth.getAuthorizationUrl(state);

  // Redirect to Zoho OAuth
  return NextResponse.redirect(authUrl);
}
