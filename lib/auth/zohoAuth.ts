import {
  ZohoAuthToken,
  ZohoUser,
  ZohoUserResponse,
  UserSession,
} from "../../types/zoho";
import { getCache, setCache, deleteCache } from "../api/cache";

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI!;
const ZOHO_ACCOUNTS_BASE =
  process.env.ZOHO_ACCOUNTS_BASE || "https://accounts.zoho.com";
const ZOHO_ORG_ID = process.env.ZOHO_ORG_ID!;
const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

// Session utilities
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export class ZohoAuthClient {
  constructor() {
    console.log("ZohoAuth Environment Variables:", {
      ZOHO_CLIENT_ID: ZOHO_CLIENT_ID
        ? `${ZOHO_CLIENT_ID.substring(0, 10)}...`
        : "MISSING",
      ZOHO_CLIENT_SECRET: ZOHO_CLIENT_SECRET ? "SET" : "MISSING",
      ZOHO_REDIRECT_URI,
      ZOHO_ACCOUNTS_BASE,
      ZOHO_ORG_ID,
    });

    if (
      !ZOHO_CLIENT_ID ||
      !ZOHO_CLIENT_SECRET ||
      !ZOHO_REDIRECT_URI ||
      !ZOHO_ORG_ID
    ) {
      throw new Error("Missing required Zoho OAuth environment variables");
    }
  }

  // Generate OAuth authorization URL
  getAuthorizationUrl(state?: string) {
    const params = new URLSearchParams({
      scope: "ZohoInventory.FullAccess.all,ZohoInventory.settings.READ",
      client_id: ZOHO_CLIENT_ID,
      response_type: "code",
      redirect_uri: ZOHO_REDIRECT_URI,
      access_type: "offline",
      ...(state && { state }),
    });

    return `${ZOHO_ACCOUNTS_BASE}/oauth/v2/auth?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<ZohoAuthToken> {
    console.log("🔄 Token exchange starting...");

    const params = new URLSearchParams({
      code,
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      redirect_uri: ZOHO_REDIRECT_URI,
      grant_type: "authorization_code",
      scope: "ZohoInventory.FullAccess.all,ZohoInventory.settings.READ",
    });

    const response = await fetch(`${ZOHO_ACCOUNTS_BASE}/oauth/v2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    console.log("📡 Token response:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Token exchange failed:", {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Token exchange successful");
    return result;
  }

  // Refresh access token using refresh token
  async refreshToken(refreshToken: string): Promise<ZohoAuthToken> {
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

  // Get current user information from Zoho
  async getCurrentUser(accessToken: string): Promise<ZohoUser> {
    const url = `https://www.zohoapis.com/inventory/v1/users/me?organization_id=${ZOHO_ORG_ID}`;
    console.log("👤 Fetching user info from:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("👤 User info response:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to get user info:", {
        status: response.status,
        error: errorText,
      });
      throw new Error(
        `Failed to get user info: ${response.status} ${errorText}`
      );
    }

    const data: ZohoUserResponse = await response.json();
    console.log("✅ User info received:", {
      name: data.user.name,
      email: data.user.email_ids[0]?.email,
    });
    return data.user;
  }

  // Create and store session - returns session ID
  async createSession(tokens: ZohoAuthToken): Promise<string> {
    console.log("👤 Getting user info...");
    const user = await this.getCurrentUser(tokens.access_token);
    console.log("✅ User info received:", user.name);

    const session: UserSession = {
      user,
      access_token: tokens.access_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
      refresh_token: tokens.refresh_token,
    };

    console.log("📦 Storing session in Redis...");
    // Store session in Redis using cache.ts and return session ID
    const sessionId = generateSessionId();
    const sessionKey = `zoho_session:${sessionId}`;
    await setCache(sessionKey, session, SESSION_TTL);
    console.log("📦 Session stored in Redis:", {
      sessionId: sessionId.substring(0, 20) + "...",
      userId: session.user.user_id,
    });

    return sessionId;
  }

  // Get session by ID from Redis
  async getSessionById(sessionId: string): Promise<UserSession | null> {
    if (!sessionId) {
      console.log("🔍 No session ID provided");
      return null;
    }

    try {
      console.log("📦 Retrieving session from Redis...");
      const sessionKey = `zoho_session:${sessionId}`;
      const session = await getCache<UserSession>(sessionKey);

      if (!session) {
        console.log(
          "📦 Session not found in Redis for ID:",
          sessionId.substring(0, 20) + "..."
        );
        return null;
      }

      console.log(
        "✅ Session retrieved from Redis for user:",
        session.user.name
      );

      // Check if token is expired
      if (Date.now() >= session.expires_at) {
        console.log("⏰ Token expired, attempting refresh...");
        if (session.refresh_token) {
          try {
            // Try to refresh the token
            const newTokens = await this.refreshToken(session.refresh_token);
            console.log("✅ Token refreshed successfully");

            // Update session in Redis with new tokens
            const updatedSession: UserSession = {
              user: session.user,
              access_token: newTokens.access_token,
              expires_at: Date.now() + newTokens.expires_in * 1000,
              refresh_token: session.refresh_token,
            };

            await setCache(
              `zoho_session:${sessionId}`,
              updatedSession,
              SESSION_TTL
            );
            console.log("📦 Session updated in Redis with new tokens");

            return updatedSession;
          } catch (error) {
            console.error("❌ Failed to refresh token:", error);
            await this.deleteSessionById(sessionId);
            return null;
          }
        } else {
          console.log("❌ No refresh token available");
          await this.deleteSessionById(sessionId);
          return null;
        }
      }

      console.log("✅ Valid session found");
      return session;
    } catch (error) {
      console.error("💥 Error getting session:", error);
      return null;
    }
  }

  // Delete session by ID from Redis
  async deleteSessionById(sessionId: string): Promise<void> {
    try {
      console.log("🗑️ Deleting session from Redis...");
      const sessionKey = `zoho_session:${sessionId}`;
      await deleteCache(sessionKey);
      console.log("✅ Session deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting session:", error);
    }
  }

  // Get authorization URL for login
  getLoginUrl(returnTo?: string): string {
    const state = returnTo
      ? Buffer.from(returnTo).toString("base64")
      : undefined;
    return this.getAuthorizationUrl(state);
  }

  // Handle OAuth callback - returns session ID
  async processCallback(
    code: string,
    state?: string
  ): Promise<{ sessionId: string; returnTo: string }> {
    try {
      const tokens = await this.exchangeCodeForTokens(code);
      const sessionId = await this.createSession(tokens);

      // Decode return URL from state
      const returnTo = state
        ? Buffer.from(state, "base64").toString()
        : "/dashboard";

      return { sessionId, returnTo };
    } catch (error) {
      console.error("Callback error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const zohoAuth = new ZohoAuthClient();
