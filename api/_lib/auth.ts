import type { VercelRequest } from "@vercel/node";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { AuthProvider, UserSession } from "@/types/domain";
import { ApiError } from "./errors";
import { isFirebaseAdminConfigured, serverEnv } from "./env";
import {
  getAuthResultForDemoToken,
  getSessionByDemoBearerToken
} from "./demo-store";
import { readBearerToken } from "./http";
import { ensureProfileSession } from "./repository";

interface FirebaseIdentity {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  provider: AuthProvider;
}

const appJwtIssuer = "uresalap.api";

function getFirebaseAdminApp() {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  return initializeApp({
    credential: cert({
      projectId: serverEnv.firebaseAdmin.projectId,
      clientEmail: serverEnv.firebaseAdmin.clientEmail,
      privateKey: serverEnv.firebaseAdmin.privateKey
    })
  });
}

function getProvider(providerId: unknown): AuthProvider {
  if (providerId === "google.com") {
    return "google";
  }

  return "password";
}

async function verifyFirebaseIdentityToken(idToken: string) {
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) {
    return null;
  }

  const decoded = await getAuth(adminApp).verifyIdToken(idToken);
  if (!decoded.uid || !decoded.email) {
    throw new ApiError(
      401,
      "Authenticated Firebase user is missing email or id."
    );
  }

  return {
    id: decoded.uid,
    email: decoded.email,
    displayName:
      typeof decoded.name === "string" && decoded.name.trim()
        ? decoded.name.trim()
        : (decoded.email.split("@")[0] ?? "User"),
    avatarUrl: typeof decoded.picture === "string" ? decoded.picture : null,
    provider: getProvider(decoded.firebase?.sign_in_provider)
  } satisfies FirebaseIdentity;
}

async function verifyAppSessionToken(token: string) {
  if (!serverEnv.appJwtSecret) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, serverEnv.appJwtSecret, {
      issuer: appJwtIssuer
    }) as JwtPayload;

    if (
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.provider !== "string"
    ) {
      throw new ApiError(401, "Session token payload is invalid.");
    }

    return await ensureProfileSession({
      id: decoded.sub,
      email: decoded.email,
      displayName:
        typeof decoded.displayName === "string" && decoded.displayName.trim()
          ? decoded.displayName
          : (decoded.email.split("@")[0] ?? "User"),
      avatarUrl:
        typeof decoded.avatarUrl === "string" ? decoded.avatarUrl : null,
      provider: decoded.provider === "google" ? "google" : "password"
    });
  } catch {
    return null;
  }
}

function issueAppBearerToken(session: UserSession) {
  if (!serverEnv.appJwtSecret) {
    return null;
  }

  return jwt.sign(
    {
      email: session.email,
      displayName: session.displayName,
      avatarUrl: session.avatarUrl,
      provider: session.provider
    },
    serverEnv.appJwtSecret,
    {
      issuer: appJwtIssuer,
      subject: session.id,
      expiresIn: "12h"
    }
  );
}

export async function exchangeIdTokenForSession(idToken: string) {
  const demoResult = getAuthResultForDemoToken(idToken);
  if (demoResult) {
    return demoResult;
  }

  const identity = await verifyFirebaseIdentityToken(idToken);
  if (!identity) {
    throw new ApiError(
      501,
      "Firebase Admin credentials are missing. Configure the server before using auth session exchange."
    );
  }

  const session = await ensureProfileSession(identity);

  return {
    session,
    bearerToken: issueAppBearerToken(session) ?? idToken
  };
}

export async function requireApiSession(request: VercelRequest) {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) {
    throw new ApiError(401, "Authorization bearer token is required.");
  }

  const demoSession = getSessionByDemoBearerToken(bearerToken);
  if (demoSession) {
    return demoSession;
  }

  const appSession = await verifyAppSessionToken(bearerToken);
  if (appSession) {
    return appSession;
  }

  const firebaseIdentity = await verifyFirebaseIdentityToken(bearerToken);
  if (firebaseIdentity) {
    return ensureProfileSession(firebaseIdentity);
  }

  throw new ApiError(
    401,
    "Authorization token could not be verified. Use a valid app session token or Firebase ID token."
  );
}
