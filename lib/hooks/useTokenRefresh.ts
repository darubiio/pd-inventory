"use client";

import { useEffect, useCallback, useRef } from "react";

const REFRESH_CHECK_INTERVAL = 5 * 60 * 1000;

interface RefreshResponse {
  success: boolean;
  expires_at: number;
  expires_in_seconds: number;
  refreshed: boolean;
}

export function useTokenRefresh() {
  const lastRefreshCheck = useRef<number>(0);

  const checkAndRefresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshCheck.current < REFRESH_CHECK_INTERVAL) {
      return;
    }

    lastRefreshCheck.current = now;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log("🔄 Session expired, redirecting to login...");
          window.location.href = `/auth/login?returnTo=${encodeURIComponent(
            window.location.pathname
          )}`;
          return;
        }
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data: RefreshResponse = await response.json();

      if (data.refreshed) {
        console.log(
          "🔄 Token refreshed successfully, expires in",
          Math.floor(data.expires_in_seconds / 60),
          "minutes"
        );
      }
    } catch (error) {
      console.error("❌ Token refresh check failed:", error);
    }
  }, []);

  useEffect(() => {
    checkAndRefresh();

    const interval = setInterval(checkAndRefresh, REFRESH_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [checkAndRefresh]);

  return { checkAndRefresh };
}
