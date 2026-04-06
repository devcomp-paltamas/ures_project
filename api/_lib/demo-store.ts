import { appConfig } from "@/lib/constants";
import { createDemoDatabase, demoSessions } from "@/lib/demo-data";
import type {
  AppPreferenceInput,
  AuthProvider,
  DemoDatabaseShape,
  ItemInput,
  ItemRecord,
  ProfileRecord,
  UserSession
} from "@/types/domain";
import { ApiError } from "./errors";

interface DemoSessionRecord extends UserSession {
  bearerToken: string;
  password?: string;
}

interface DemoStoreState {
  database: DemoDatabaseShape;
  sessions: DemoSessionRecord[];
}

interface AuthIdentity {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  provider: AuthProvider;
}

declare global {
  var __uresalapApiStore: DemoStoreState | undefined;
}

function createInitialStore(): DemoStoreState {
  return {
    database: createDemoDatabase(),
    sessions: demoSessions.map((entry) => ({
      id: entry.id,
      email: entry.email,
      displayName: entry.displayName,
      avatarUrl: entry.avatarUrl,
      language: entry.language,
      theme: entry.theme,
      provider: entry.provider,
      bearerToken: entry.bearerToken,
      password: entry.password
    }))
  };
}

function getStore() {
  globalThis.__uresalapApiStore ??= createInitialStore();
  return globalThis.__uresalapApiStore;
}

function createSession(profile: ProfileRecord, provider: AuthProvider): UserSession {
  return {
    id: profile.userId,
    email: profile.email,
    displayName: profile.displayName,
    avatarUrl: profile.avatarUrl,
    language: profile.language,
    theme: profile.theme,
    provider
  };
}

function getAccessibleItems(database: DemoDatabaseShape, session: UserSession | null) {
  return database.items.filter((item) => {
    if (item.visibility === "public") {
      return true;
    }

    if (!session) {
      return false;
    }

    if (item.ownerId === session.id) {
      return true;
    }

    return item.visibility === "members";
  });
}

function requireOwner(item: ItemRecord | undefined, session: UserSession) {
  if (!item) {
    throw new ApiError(404, "Item not found.");
  }

  if (item.ownerId !== session.id) {
    throw new ApiError(403, "Only the owner can modify this item.");
  }

  return item;
}

export function resetDemoStore() {
  globalThis.__uresalapApiStore = createInitialStore();
}

export function getBootstrapPayload() {
  const { database } = getStore();
  return {
    landingBlocks: database.landingBlocks.filter((block) => block.isPublished),
    publicItems: database.items.filter((item) => item.visibility === "public")
  };
}

export function getSessionByDemoBearerToken(bearerToken: string | null) {
  if (!bearerToken) {
    return null;
  }

  const { sessions, database } = getStore();
  const session = sessions.find((entry) => entry.bearerToken === bearerToken);
  if (!session) {
    return null;
  }

  const profile = database.profiles.find((entry) => entry.userId === session.id);
  if (!profile) {
    return session;
  }

  return createSession(profile, session.provider);
}

export function getAuthResultForDemoToken(idToken: string) {
  const session = getSessionByDemoBearerToken(idToken);
  if (!session) {
    return null;
  }

  return {
    session,
    bearerToken:
      session.provider === "google" ? "demo-google-token" : appConfig.mockBearerToken
  };
}

export function ensureProfileSession(identity: AuthIdentity) {
  const store = getStore();
  let profile = store.database.profiles.find((entry) => entry.userId === identity.id);
  const now = new Date().toISOString();

  if (!profile) {
    profile = {
      userId: identity.id,
      email: identity.email,
      displayName: identity.displayName,
      avatarUrl: identity.avatarUrl,
      language: "hu",
      theme: "system",
      createdAt: now,
      updatedAt: now
    };

    store.database.profiles.unshift(profile);
  } else {
    profile.email = identity.email;
    profile.displayName = profile.displayName || identity.displayName;
    profile.avatarUrl = profile.avatarUrl ?? identity.avatarUrl;
    profile.updatedAt = now;
  }

  return createSession(profile, identity.provider);
}

export function listItemsForSession(session: UserSession | null) {
  const { database } = getStore();
  return {
    items: getAccessibleItems(database, session)
  };
}

export function getProfileForSession(session: UserSession) {
  const { database } = getStore();
  const profile = database.profiles.find((entry) => entry.userId === session.id);
  if (!profile) {
    throw new ApiError(404, "Profile not found.");
  }

  return { profile };
}

export function updateProfileForSession(session: UserSession, input: AppPreferenceInput) {
  const store = getStore();
  const profile = store.database.profiles.find((entry) => entry.userId === session.id);
  if (!profile) {
    throw new ApiError(404, "Profile not found.");
  }

  profile.displayName = input.displayName;
  profile.avatarUrl = input.avatarUrl;
  profile.language = input.language;
  profile.theme = input.theme;
  profile.updatedAt = new Date().toISOString();

  return { profile };
}

export function createItemForSession(session: UserSession, input: ItemInput) {
  const { database } = getStore();
  const now = new Date().toISOString();
  const item: ItemRecord = {
    id: `item_${crypto.randomUUID()}`,
    ownerId: session.id,
    title: input.title,
    summary: input.summary,
    visibility: input.visibility,
    isPinned: input.isPinned,
    createdAt: now,
    updatedAt: now
  };

  database.items.unshift(item);
  return item;
}

export function updateItemForSession(session: UserSession, itemId: string, input: ItemInput) {
  const { database } = getStore();
  const item = requireOwner(
    database.items.find((entry) => entry.id === itemId),
    session
  );

  item.title = input.title;
  item.summary = input.summary;
  item.visibility = input.visibility;
  item.isPinned = input.isPinned;
  item.updatedAt = new Date().toISOString();

  return item;
}

export function deleteItemForSession(session: UserSession, itemId: string) {
  const { database } = getStore();
  const index = database.items.findIndex((entry) => entry.id === itemId);

  if (index === -1) {
    throw new ApiError(404, "Item not found.");
  }

  requireOwner(database.items[index], session);
  database.items.splice(index, 1);
  return { id: itemId };
}
