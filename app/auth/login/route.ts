import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../lib/auth/zohoAuth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const returnTo = searchParams.get("returnTo");

  const state = returnTo ? Buffer.from(returnTo).toString("base64") : undefined;

  const authUrl = zohoAuth.getAuthorizationUrl(state);

  return NextResponse.redirect(authUrl);
}
