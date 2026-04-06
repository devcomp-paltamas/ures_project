import {
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User
} from "firebase/auth";
import { env, isFirebaseConfigured } from "@/lib/env";
import { createGoogleProvider, getFirebaseAuth } from "@/lib/firebase";
import { appConfig, storageKeys } from "@/lib/constants";
import {
  readLanguagePreference,
  readSession,
  readThemePreference,
  writeSession
} from "@/lib/browser-storage";
import { mockGoogleSignIn, mockSignIn, mockSignUp } from "@/api/mock-api";
import {
  locales,
  themeModes,
  type AuthResult,
  type Locale,
  type ThemeMode,
  type UserSession
} from "@/types/domain";

export interface AuthStateSnapshot {
  session: UserSession | null;
  bearerToken: string | null;
  isReady: boolean;
}

function shouldUseMockAuth() {
  return env.authMode === "mock" || !isFirebaseConfigured();
}

function isLocale(value: string | null): value is Locale {
  return locales.includes(value as Locale);
}

function isThemeMode(value: string | null): value is ThemeMode {
  return themeModes.includes(value as ThemeMode);
}

function getSessionLanguage(storedSession: UserSession | null) {
  if (storedSession?.language) {
    return storedSession.language;
  }

  const preferredLanguage = readLanguagePreference();
  return isLocale(preferredLanguage) ? preferredLanguage : "hu";
}

function getSessionTheme(storedSession: UserSession | null) {
  if (storedSession?.theme) {
    return storedSession.theme;
  }

  const preferredTheme = readThemePreference();
  return isThemeMode(preferredTheme) ? preferredTheme : "system";
}

function getProvider(user: User, storedSession: UserSession | null) {
  const providerIds = user.providerData.map((entry) => entry.providerId);
  if (providerIds.includes(env.firebase.googleProviderId)) {
    return "google";
  }

  if (providerIds.includes("password")) {
    return "password";
  }

  return storedSession?.provider ?? "password";
}

function createSessionFromFirebaseUser(user: User) {
  const storedSession = readSession();

  return {
    id: user.uid,
    email: user.email ?? storedSession?.email ?? "",
    displayName:
      user.displayName?.trim() ||
      storedSession?.displayName ||
      user.email?.split("@")[0] ||
      "User",
    avatarUrl: user.photoURL ?? storedSession?.avatarUrl ?? null,
    language: getSessionLanguage(
      storedSession?.id === user.uid ? storedSession : null
    ),
    theme: getSessionTheme(
      storedSession?.id === user.uid ? storedSession : null
    ),
    provider: getProvider(
      user,
      storedSession?.id === user.uid ? storedSession : null
    )
  } satisfies UserSession;
}

async function createFirebaseAuthResult(user: User): Promise<AuthResult> {
  const session = createSessionFromFirebaseUser(user);
  const bearerToken = await user.getIdToken();
  persistSession(session);

  return {
    session,
    bearerToken
  };
}

function getMockBearerToken(session: UserSession | null) {
  if (!session) {
    return null;
  }

  if (session.provider === "google") {
    return "demo-google-token";
  }

  return appConfig.mockBearerToken;
}

function createReadySnapshot(
  session: UserSession | null,
  bearerToken: string | null
): AuthStateSnapshot {
  return {
    session,
    bearerToken,
    isReady: true
  };
}

export function loadStoredSession() {
  return readSession();
}

export function persistSession(session: UserSession | null) {
  writeSession(session);
}

export function isUsingMockAuth() {
  return shouldUseMockAuth();
}

export function getInitialAuthState(): AuthStateSnapshot {
  if (shouldUseMockAuth()) {
    const session = loadStoredSession();
    return createReadySnapshot(session, getMockBearerToken(session));
  }

  return {
    session: null,
    bearerToken: null,
    isReady: false
  };
}

export async function signInWithPassword(email: string, password: string) {
  if (shouldUseMockAuth()) {
    return mockSignIn(email, password);
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is not configured.");
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return createFirebaseAuthResult(credential.user);
}

export async function signUpWithPassword(
  email: string,
  password: string,
  displayName: string
) {
  if (shouldUseMockAuth()) {
    return mockSignUp(email, password, displayName);
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is not configured.");
  }

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(credential.user, { displayName });
  await credential.user.reload();

  return createFirebaseAuthResult(auth.currentUser ?? credential.user);
}

export async function signInWithGoogle() {
  if (shouldUseMockAuth()) {
    return mockGoogleSignIn();
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is not configured.");
  }

  const credential = await signInWithPopup(auth, createGoogleProvider());
  return createFirebaseAuthResult(credential.user);
}

export async function signOut() {
  if (!shouldUseMockAuth()) {
    const auth = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
  }

  writeSession(null);
  return Promise.resolve();
}

export function subscribeToAuthState(
  listener: (snapshot: AuthStateSnapshot) => void
) {
  if (shouldUseMockAuth()) {
    listener(getInitialAuthState());

    function handleStorage(event: StorageEvent) {
      if (event.key && event.key !== storageKeys.session) {
        return;
      }

      const session = loadStoredSession();
      listener(createReadySnapshot(session, getMockBearerToken(session)));
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    listener(createReadySnapshot(null, null));
    return () => {};
  }

  let sequence = 0;

  const unsubscribe = onIdTokenChanged(auth, (user) => {
    const currentSequence = sequence + 1;
    sequence = currentSequence;

    if (!user) {
      persistSession(null);
      listener(createReadySnapshot(null, null));
      return;
    }

    void createFirebaseAuthResult(user)
      .then((result) => {
        if (sequence !== currentSequence) {
          return;
        }

        listener(createReadySnapshot(result.session, result.bearerToken));
      })
      .catch(() => {
        if (sequence !== currentSequence) {
          return;
        }

        listener(createReadySnapshot(loadStoredSession(), null));
      });
  });

  return () => {
    sequence += 1;
    unsubscribe();
  };
}

export async function getBearerToken(forceRefresh = false) {
  if (shouldUseMockAuth()) {
    return getMockBearerToken(readSession());
  }

  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
}

export function getAuthErrorKey(error: unknown) {
  const errorCode =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : error instanceof Error
        ? error.message
        : "";

  if (
    errorCode === "auth/email-already-in-use" ||
    errorCode === "EMAIL_ALREADY_EXISTS"
  ) {
    return "auth.emailAlreadyInUse";
  }

  if (
    errorCode === "auth/popup-closed-by-user" ||
    errorCode === "auth/cancelled-popup-request"
  ) {
    return "auth.googlePopupClosed";
  }

  if (
    errorCode === "auth/user-not-found" ||
    errorCode === "auth/wrong-password" ||
    errorCode === "auth/invalid-credential" ||
    errorCode === "INVALID_CREDENTIALS"
  ) {
    return "auth.invalidCredentials";
  }

  return "auth.unexpectedError";
}
