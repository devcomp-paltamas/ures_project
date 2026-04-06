import { createContext } from "react";
import type { UserSession } from "@/types/domain";

export interface AuthContextValue {
  session: UserSession | null;
  bearerToken: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateSession: (next: Partial<UserSession>) => void;
  refreshBearerToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
