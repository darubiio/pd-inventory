"use server";

import { Redis } from "@upstash/redis";
import { ZohoAuthToken } from "../types";

const REDIS = Redis.fromEnv();
const ZOHO_TOKEN_KEY = "zoho_token";

export const fetchToken = async (): Promise<string> => {
  const body = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: process.env.ZOHO_GRANT_TYPE!,
  });

  const url = `https://accounts.zoho.${process.env.ZOHO_DOMAIN}/oauth/v2/token`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data: ZohoAuthToken = await res.json();

  if (res.status !== 200) {
    throw new Error("Failed to fetch Zoho auth-token");
  }

  if (data.access_token) return data.access_token;

  throw new Error("No access token found in response");
};

export const getAuthToken = async () => {
  const token = await REDIS.get(ZOHO_TOKEN_KEY);
  if (!token) {
    const newToken = await fetchToken();
    await REDIS.set(ZOHO_TOKEN_KEY, newToken, { ex: 2700 });
    return newToken;
  }
  return token;
};
