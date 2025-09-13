import { useState, useEffect } from "react";
import { UserProfile } from "../../types/user";

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🧑‍💼 useUser: Starting fetch user");
        setLoading(true);
        const response = await fetch("/api/user/profile");

        console.log("🧑‍💼 useUser: Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("🧑‍💼 useUser: Error response:", errorText);
          throw new Error("Failed to fetch user profile");
        }

        const userData = await response.json();
        console.log("🧑‍💼 useUser: User data received:", userData);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("🧑‍💼 useUser: Error fetching user:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
