"use server";

import { UserSession } from "../../types/zoho";
import {
  getCache,
  setCache,
  deleteCache,
  getCacheKeys,
  stripEnvPrefix,
} from "../api/cache";

const SESSION_PREFIX = "zoho_session:";
const SESSION_TTL = 24 * 60 * 60;

async function generateSessionId(): Promise<string> {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export async function storeSession(session: UserSession): Promise<string> {
  try {
    const sessionId = await generateSessionId();
    const key = `${SESSION_PREFIX}${sessionId}`;
    await setCache(key, session, SESSION_TTL);
    console.log("💾 Session stored in Redis:", {
      sessionId: sessionId.substring(0, 20) + "...",
      userId: session.user.user_id,
    });
    return sessionId;
  } catch (error) {
    console.error("❌ Failed to store session in Redis:", error);
    throw new Error("Failed to store session");
  }
}

export async function getSession(
  sessionId: string
): Promise<UserSession | null> {
  try {
    if (!sessionId) {
      console.log("🔍 No session ID provided");
      return null;
    }

    const key = `${SESSION_PREFIX}${sessionId}`;
    const session = await getCache<UserSession>(key);

    if (!session) {
      console.log(
        "🔍 Session not found in Redis:",
        sessionId.substring(0, 20) + "..."
      );
      return null;
    }

    console.log("✅ Session found in Redis:", {
      sessionId: sessionId.substring(0, 20) + "...",
      userId: session.user.user_id,
    });
    return session;
  } catch (error) {
    console.error("❌ Failed to get session from Redis:", error);
    return null;
  }
}

export async function updateSession(
  sessionId: string,
  session: UserSession
): Promise<void> {
  try {
    const key = `${SESSION_PREFIX}${sessionId}`;
    await setCache(key, session, SESSION_TTL);
    console.log("🔄 Session updated in Redis:", {
      sessionId: sessionId.substring(0, 20) + "...",
      userId: session.user.user_id,
    });
  } catch (error) {
    console.error("❌ Failed to update session in Redis:", error);
    throw new Error("Failed to update session");
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const key = `${SESSION_PREFIX}${sessionId}`;
    await deleteCache(key);
    console.log(
      "🗑️ Session deleted from Redis:",
      sessionId.substring(0, 20) + "..."
    );
  } catch (error) {
    console.error("❌ Failed to delete session from Redis:", error);
  }
}

export async function getAllSessions(): Promise<
  { sessionId: string; session: UserSession }[]
> {
  try {
    const pattern = `${SESSION_PREFIX}*`;
    const foundKeys = await getCacheKeys(pattern);
    console.log("🔍 Found sessions in Redis:", foundKeys.length);

    const sessionPromises = foundKeys.map(async (key) => {
      const cleanKey = await stripEnvPrefix(key);
      const sessionId = cleanKey.replace(SESSION_PREFIX, "");
      const session = await getCache<UserSession>(cleanKey);
      return session ? { sessionId, session } : null;
    });

    const results = await Promise.all(sessionPromises);
    return results.filter(
      (result): result is { sessionId: string; session: UserSession } =>
        result !== null
    );
  } catch (error) {
    console.error("❌ Failed to get all sessions:", error);
    return [];
  }
}
