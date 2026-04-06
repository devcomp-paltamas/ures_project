import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import {
  getBearerToken,
  getInitialAuthState,
  persistSession,
  signInWithGoogle,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  subscribeToAuthState,
  type AuthStateSnapshot
} from "@/features/auth/auth-service";
import type { UserSession } from "@/types/domain";

interface AuthContextValue {
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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthStateSnapshot>(() =>
    getInitialAuthState()
  );

  useEffect(() => {
    return subscribeToAuthState((nextState) => {
      setAuthState(nextState);
    });
  }, []);

  async function handlePasswordSignIn(email: string, password: string) {
    const result = await signInWithPassword(email, password);
    setAuthState({
      session: result.session,
      bearerToken: result.bearerToken,
      isReady: true
    });
  }

  async function handlePasswordSignUp(
    email: string,
    password: string,
    displayName: string
  ) {
    const result = await signUpWithPassword(email, password, displayName);
    setAuthState({
      session: result.session,
      bearerToken: result.bearerToken,
      isReady: true
    });
  }

  async function handleGoogleSignIn() {
    const result = await signInWithGoogle();
    setAuthState({
      session: result.session,
      bearerToken: result.bearerToken,
      isReady: true
    });
  }

  async function handleSignOut() {
    await signOut();
    setAuthState({
      session: null,
      bearerToken: null,
      isReady: true
    });
  }

  function updateSession(next: Partial<UserSession>) {
    setAuthState((current) => {
      if (!current.session) {
        return current;
      }

      const updated = { ...current.session, ...next };
      persistSession(updated);
      return {
        ...current,
        session: updated
      };
    });
  }

  async function refreshBearerToken() {
    const token = await getBearerToken(true);
    setAuthState((current) => ({
      ...current,
      bearerToken: token
    }));
    return token;
  }

  const value: AuthContextValue = {
    session: authState.session,
    bearerToken: authState.bearerToken,
    isAuthenticated: Boolean(authState.session),
    isReady: authState.isReady,
    signIn: handlePasswordSignIn,
    signUp: handlePasswordSignUp,
    signInGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    updateSession,
    refreshBearerToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
