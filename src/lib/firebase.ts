import { initializeApp, getApps } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth
} from "firebase/auth";
import { env, isFirebaseConfigured } from "@/lib/env";

let authInstance: Auth | null = null;

export function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (authInstance) {
    return authInstance;
  }

  const app =
    getApps()[0] ??
    initializeApp({
      apiKey: env.firebase.apiKey,
      authDomain: env.firebase.authDomain,
      projectId: env.firebase.projectId,
      storageBucket: env.firebase.storageBucket,
      messagingSenderId: env.firebase.messagingSenderId,
      appId: env.firebase.appId
    });

  const auth = getAuth(app);
  void setPersistence(auth, browserLocalPersistence);
  authInstance = auth;

  return auth;
}

export function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account"
  });
  return provider;
}
