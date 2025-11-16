"use server";

import { UserSession, ZohoAuthToken } from "../../types/zoho";
import { updateSession } from "./sessionStore";

const REFRESH_BUFFER_SECONDS = 300;
const MIN_TIME_BETWEEN_REFRESHES = 10;

const activeRefreshes = new Map<string, Promise<ZohoAuthToken>>();
const lastRefreshTime = new Map<string, number>();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI!;
const ZOHO_ACCOUNTS_BASE =
  process.env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.com";

async function performTokenRefresh(
  refreshToken: string
): Promise<ZohoAuthToken> {
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    redirect_uri: ZOHO_REDIRECT_URI,
    grant_type: "refresh_token",
  });

  const response = await fetch(`${ZOHO_ACCOUNTS_BASE}/oauth/v2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

function buildUpdatedSession(
  session: UserSession,
  newTokens: ZohoAuthToken
): UserSession {
  const now = Date.now();
  return {
    ...session,
    access_token: newTokens.access_token,
    expires_at: now + newTokens.expires_in * 1000,
    refreshed_at: now,
    refresh_count: (session.refresh_count || 0) + 1,
    last_activity: now,
  };
}

function shouldRefreshToken(session: UserSession): boolean {
  const timeUntilExpiry = session.expires_at - Date.now();
  return timeUntilExpiry < REFRESH_BUFFER_SECONDS * 1000;
}

function canRefreshNow(sessionId: string): boolean {
  const lastRefresh = lastRefreshTime.get(sessionId);
  if (!lastRefresh) return true;

  const timeSinceLastRefresh = (Date.now() - lastRefresh) / 1000;
  return timeSinceLastRefresh >= MIN_TIME_BETWEEN_REFRESHES;
}

export async function refreshTokenIfNeeded(
  sessionId: string,
  session: UserSession
): Promise<UserSession> {
  if (!session.refresh_token) {
    console.log("❌ No refresh token available for session:", sessionId);
    throw new Error("No refresh token available");
  }

  if (!shouldRefreshToken(session)) {
    session.last_activity = Date.now();
    await updateSession(sessionId, session);
    return session;
  }

  if (!canRefreshNow(sessionId)) {
    console.log(
      "⏳ Recent refresh detected, skipping:",
      sessionId.substring(0, 20) + "..."
    );
    return session;
  }

  const existingRefresh = activeRefreshes.get(sessionId);
  if (existingRefresh) {
    console.log(
      "🔄 Refresh already in progress, waiting:",
      sessionId.substring(0, 20) + "..."
    );
    const newTokens = await existingRefresh;
    return buildUpdatedSession(session, newTokens);
  }

  console.log("🔄 Starting token refresh:", sessionId.substring(0, 20) + "...");

  const refreshPromise = performTokenRefresh(session.refresh_token);
  activeRefreshes.set(sessionId, refreshPromise);

  try {
    const newTokens = await refreshPromise;
    const updatedSession = buildUpdatedSession(session, newTokens);

    await updateSession(sessionId, updatedSession);
    lastRefreshTime.set(sessionId, Date.now());

    console.log("✅ Token refreshed successfully:", {
      sessionId: sessionId.substring(0, 20) + "...",
      refreshCount: updatedSession.refresh_count,
      expiresIn: Math.floor(
        (updatedSession.expires_at - Date.now()) / 1000 / 60
      ),
    });

    return updatedSession;
  } catch (error) {
    console.error(
      "❌ Token refresh failed:",
      sessionId.substring(0, 20) + "...",
      error
    );
    throw error;
  } finally {
    activeRefreshes.delete(sessionId);
  }
}

export async function getTokenExpiryInfo(session: UserSession): Promise<{
  expiresInSeconds: number;
  needsRefresh: boolean;
  isExpired: boolean;
}> {
  const now = Date.now();
  const expiresInSeconds = Math.floor((session.expires_at - now) / 1000);

  return {
    expiresInSeconds,
    needsRefresh: expiresInSeconds < REFRESH_BUFFER_SECONDS,
    isExpired: expiresInSeconds <= 0,
  };
}

export async function clearRefreshState(sessionId: string): Promise<void> {
  activeRefreshes.delete(sessionId);
  lastRefreshTime.delete(sessionId);
}
