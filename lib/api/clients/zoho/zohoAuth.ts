"use server";

import { headers } from "next/headers";
import { ZohoAuthToken } from "../../../../types";
import { apiFetch } from "../../client";
import { AuthConfig } from "../../types/clientTypes";
import { zohoAuth } from "../../../auth/zohoAuth";

const URL = `https://accounts.zoho.${process.env.ZOHO_DOMAIN}/oauth/v2/token`;
const HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };
const BODY = new URLSearchParams({
  refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
  client_id: process.env.ZOHO_CLIENT_ID!,
  client_secret: process.env.ZOHO_CLIENT_SECRET!,
  grant_type: process.env.ZOHO_GRANT_TYPE!,
});
const TOKEN_HEADER = "Zoho-oauthtoken";

export const getAuthToken = async (): Promise<ZohoAuthToken> => {
  return apiFetch<ZohoAuthToken>(URL, {
    cacheCfg: { key: TOKEN_HEADER, ttl: 2700 },
    method: "POST",
    headers: HEADERS,
    body: BODY,
  });
};

export const getAccessToken = async (): Promise<string> => {
  const { access_token } = await getAuthToken();
  if (access_token) return access_token;
  else throw new Error("No access token found");
};

export const getAuth = async (): Promise<AuthConfig> => ({
  header: TOKEN_HEADER,
  getToken: async () => await getAccessToken(),
});

export const getUserAccessToken = async (): Promise<string> => {
  const headersList = await headers();
  const sessionId = headersList.get("x-session-id");

  const userAuthError = (msg: string) => {
    throw new Error(`User not authenticated: ${msg}`);
  };

  if (!sessionId) return userAuthError("no session ID in headers");

  const session = await zohoAuth.getSessionById(sessionId);
  if (!session) return userAuthError("invalid session");

  console.log("🔑 Access token retrieved for user:", session.user.name);
  return session.access_token;
};

export const getUserAuth = async (): Promise<AuthConfig> => ({
  header: TOKEN_HEADER,
  getToken: async () => await getUserAccessToken(),
});
