"use server";

import { headers } from "next/headers";
import { ZohoAuthToken } from "../../../../types";
import { AuthConfig } from "../../types/clientTypes";
import { zohoAuth } from "../../../auth/zohoAuth";

const TOKEN_HEADER = "Zoho-oauthtoken";

// Get user's access token (gets session ID from headers)
export const getUserAccessToken = async (): Promise<string> => {
  const headersList = await headers();
  const sessionId = headersList.get("x-session-id");

  console.log(
    "🔑 Getting user access token for session:",
    sessionId ? sessionId.substring(0, 20) + "..." : "NO SESSION ID"
  );

  if (!sessionId) {
    throw new Error("User not authenticated - no session ID in headers");
  }

  const session = await zohoAuth.getSessionById(sessionId);
  if (!session) {
    throw new Error("User not authenticated - invalid session");
  }

  console.log("🔑 Access token retrieved for user:", session.user.name);
  return session.access_token;
};

// Get auth config using user's token
export const getUserAuth = async (): Promise<AuthConfig> => ({
  header: TOKEN_HEADER,
  getToken: async () => await getUserAccessToken(),
});

// Legacy functions - using app refresh token (keep for backward compatibility)
// TODO: Migrate to user tokens for better security

const URL = `https://accounts.zoho.${process.env.ZOHO_DOMAIN}/oauth/v2/token`;
const HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };

// Only use this for system/admin operations if absolutely necessary
export const getAppAuthToken = async (): Promise<ZohoAuthToken> => {
  if (!process.env.ZOHO_REFRESH_TOKEN) {
    throw new Error(
      "App refresh token not configured. Use getUserAuth() instead for user operations."
    );
  }

  const BODY = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: process.env.ZOHO_GRANT_TYPE!,
  });

  const response = await fetch(URL, {
    method: "POST",
    headers: HEADERS,
    body: BODY,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `App token refresh failed: ${response.status} ${errorText}`
    );
  }

  return response.json();
};

export const getAppAccessToken = async (): Promise<string> => {
  const { access_token } = await getAppAuthToken();
  if (access_token) return access_token;
  else throw new Error("No app access token found");
};

export const getAppAuth = async (): Promise<AuthConfig> => ({
  header: TOKEN_HEADER,
  getToken: async () => await getAppAccessToken(),
});

// Legacy exports for backward compatibility
export const getAuthToken = getAppAuthToken;
export const getAccessToken = getAppAccessToken;
export const getAuth = getAppAuth;
