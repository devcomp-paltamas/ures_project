function normalizeApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL?.trim();
  return value ? value.replace(/\/$/, "") : "";
}

export const env = {
  appEnv: import.meta.env.VITE_APP_ENV ?? "preview",
  authMode: import.meta.env.VITE_AUTH_MODE ?? "mock",
  apiBaseUrl: normalizeApiBaseUrl(),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
    googleProviderId:
      import.meta.env.VITE_FIREBASE_GOOGLE_PROVIDER_ID ?? "google.com"
  }
} as const;

export function isFirebaseConfigured() {
  return Boolean(
    env.firebase.apiKey &&
    env.firebase.authDomain &&
    env.firebase.projectId &&
    env.firebase.appId
  );
}

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
