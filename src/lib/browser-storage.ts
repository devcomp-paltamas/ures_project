import { storageKeys } from "@/lib/constants";
import { createDemoDatabase } from "@/lib/demo-data";
import type { DemoDatabaseShape, UserSession } from "@/types/domain";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readSession() {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(storageKeys.session);
  return raw ? (JSON.parse(raw) as UserSession) : null;
}

export function writeSession(session: UserSession | null) {
  if (!isBrowser()) {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(storageKeys.session);
    return;
  }

  window.localStorage.setItem(storageKeys.session, JSON.stringify(session));
}

export function readThemePreference() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(storageKeys.theme);
}

export function writeThemePreference(theme: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(storageKeys.theme, theme);
}

export function readLanguagePreference() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(storageKeys.language);
}

export function writeLanguagePreference(language: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(storageKeys.language, language);
}

export function readDemoDatabase() {
  if (!isBrowser()) {
    return createDemoDatabase();
  }

  const raw = window.localStorage.getItem(storageKeys.database);
  if (!raw) {
    const initial = createDemoDatabase();
    window.localStorage.setItem(storageKeys.database, JSON.stringify(initial));
    return initial;
  }

  return JSON.parse(raw) as DemoDatabaseShape;
}

export function writeDemoDatabase(database: DemoDatabaseShape) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(storageKeys.database, JSON.stringify(database));
}

export function resetDemoDatabase() {
  const fresh = createDemoDatabase();
  writeDemoDatabase(fresh);
  return fresh;
}
