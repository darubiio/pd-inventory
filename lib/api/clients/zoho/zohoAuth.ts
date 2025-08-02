"use server";

import { ZohoAuthToken } from "../../../../types";
import { apiFetch } from "../../client";

const URL = `https://accounts.zoho.${process.env.ZOHO_DOMAIN}/oauth/v2/token`;
const HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };
const BODY = new URLSearchParams({
  refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
  client_id: process.env.ZOHO_CLIENT_ID!,
  client_secret: process.env.ZOHO_CLIENT_SECRET!,
  grant_type: process.env.ZOHO_GRANT_TYPE!,
});
const CACHE_KEY = "zoho_auth_token";

export const getAuthToken = async (): Promise<ZohoAuthToken> => {
  return apiFetch<ZohoAuthToken>(URL, {
    cacheCfg: { key: CACHE_KEY, ttl: 2700 },
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
