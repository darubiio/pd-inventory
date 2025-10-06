import { useState, useEffect } from "react";
import { ZohoUserData } from "../../types/user";

export function useUser() {
  const [user, setUser] = useState<ZohoUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        let response = await fetch("/api/auth/user");

        if (!response.ok && response.status === 404) {
          response = await fetch("/api/user/profile");
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error("Failed to fetch user profile " + errorText);
        }

        const userData = await response.json();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading: loading, error };
}
