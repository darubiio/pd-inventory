import { ReactNode } from "react";
import { ZohoUser } from "../../types";

export interface UserContextType {
  user: ZohoUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserProviderProps {
  initialUser?: ZohoUser | null;
  children: ReactNode;
}
