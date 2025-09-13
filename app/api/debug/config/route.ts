import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID
        ? `${process.env.ZOHO_CLIENT_ID.substring(0, 10)}...`
        : "MISSING",
      ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET ? "SET" : "MISSING",
      ZOHO_REDIRECT_URI: process.env.ZOHO_REDIRECT_URI,
      ZOHO_ACCOUNTS_BASE: process.env.ZOHO_ACCOUNTS_BASE,
      ZOHO_ORG_ID: process.env.ZOHO_ORG_ID,
      ZOHO_DOMAIN: process.env.ZOHO_DOMAIN,
    },
    server: {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    },
  });
}
