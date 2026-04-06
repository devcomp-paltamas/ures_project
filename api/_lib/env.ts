function readEnvValue(key: string, fallbackKey?: string) {
  const direct = process.env[key]?.trim();
  if (direct) {
    return direct;
  }

  if (!fallbackKey) {
    return "";
  }

  return process.env[fallbackKey]?.trim() ?? "";
}

export const serverEnv = {
  authMode: readEnvValue("AUTH_MODE", "VITE_AUTH_MODE") || "mock",
  appJwtSecret: readEnvValue("APP_JWT_SECRET", "JWT_SECRET"),
  supabase: {
    url: readEnvValue("SUPABASE_URL", "VITE_SUPABASE_URL"),
    serviceRoleKey: readEnvValue("SUPABASE_SERVICE_ROLE_KEY")
  },
  firebaseAdmin: {
    projectId: readEnvValue("FIREBASE_ADMIN_PROJECT_ID"),
    clientEmail: readEnvValue("FIREBASE_ADMIN_CLIENT_EMAIL"),
    privateKey: readEnvValue("FIREBASE_ADMIN_PRIVATE_KEY").replace(/\\n/g, "\n")
  }
} as const;

export function isFirebaseAdminConfigured() {
  return Boolean(
    serverEnv.firebaseAdmin.projectId &&
    serverEnv.firebaseAdmin.clientEmail &&
    serverEnv.firebaseAdmin.privateKey
  );
}
