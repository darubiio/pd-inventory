"use client";

import useSWR, { SWRConfig } from "swr";
import { createContext, useContext } from "react";
import { PermissionsProvider } from "./PermissionsProvider";
import { UserContextType, UserProviderProps } from "./authTypes";
import { fetcher } from "../api/swr/swrConfig";

const initialState = { user: null, isLoading: true, error: null };
const UserContext = createContext<UserContextType>(initialState);

export function UserProvider({ children }: UserProviderProps) {
  const { data, error, isLoading } = useSWR("/api/auth/user");
  return (
    <SWRConfig value={{ fetcher }}>
      <UserContext.Provider value={{ user: data, isLoading, error }}>
        <PermissionsProvider>{children}</PermissionsProvider>
      </UserContext.Provider>
    </SWRConfig>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
