import { appConfig } from "@/lib/constants";
import { demoSessions } from "@/lib/demo-data";
import {
  readDemoDatabase,
  readSession,
  resetDemoDatabase,
  writeDemoDatabase
} from "@/lib/browser-storage";
import { generateId, sleep } from "@/lib/utils";
import type {
  AppPreferenceInput,
  AuthResult,
  BootstrapPayload,
  ItemInput,
  ItemRecord,
  ItemsPayload,
  ProfilePayload,
  UserSession
} from "@/types/domain";

const mockDelay = 320;

function getSessionByBearer(bearerToken: string | null) {
  if (!bearerToken) {
    return null;
  }

  return demoSessions.find((entry) => entry.bearerToken === bearerToken) ?? readSession();
}

function requireSession(bearerToken: string | null) {
  const session = getSessionByBearer(bearerToken);
  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

function getAccessibleItems(session: UserSession | null) {
  const { items } = readDemoDatabase();

  return items.filter((item) => {
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

export async function mockBootstrap(): Promise<BootstrapPayload> {
  await sleep(mockDelay);
  const database = readDemoDatabase();
  return {
    landingBlocks: database.landingBlocks.filter((block) => block.isPublished),
    publicItems: database.items.filter((item) => item.visibility === "public")
  };
}

export async function mockSignIn(email: string, password: string): Promise<AuthResult> {
  await sleep(mockDelay);
  const demoUser = demoSessions.find((entry) => entry.email === email && entry.password === password);
  if (!demoUser) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    session: {
      id: demoUser.id,
      email: demoUser.email,
      displayName: demoUser.displayName,
      avatarUrl: demoUser.avatarUrl,
      language: demoUser.language,
      theme: demoUser.theme,
      provider: demoUser.provider
    },
    bearerToken: demoUser.bearerToken
  };
}

export async function mockSignUp(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> {
  await sleep(mockDelay);
  const database = readDemoDatabase();
  const existing = database.profiles.find((profile) => profile.email === email);
  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const userId = generateId("user");
  const now = new Date().toISOString();
  const session: UserSession = {
    id: userId,
    email,
    displayName,
    avatarUrl: null,
    language: "en",
    theme: "system",
    provider: "password"
  };

  demoSessions.push({
    ...session,
    password,
    bearerToken: generateId("token")
  });

  database.profiles.push({
    userId,
    email,
    displayName,
    avatarUrl: null,
    language: "en",
    theme: "system",
    createdAt: now,
    updatedAt: now
  });
  writeDemoDatabase(database);

  return {
    session,
    bearerToken: demoSessions.at(-1)?.bearerToken ?? appConfig.mockBearerToken
  };
}

export async function mockGoogleSignIn(): Promise<AuthResult> {
  await sleep(mockDelay);
  const googleUser = demoSessions.find((entry) => entry.provider === "google");
  if (!googleUser) {
    throw new Error("GOOGLE_PROVIDER_NOT_AVAILABLE");
  }

  return {
    session: {
      id: googleUser.id,
      email: googleUser.email,
      displayName: googleUser.displayName,
      avatarUrl: googleUser.avatarUrl,
      language: googleUser.language,
      theme: googleUser.theme,
      provider: googleUser.provider
    },
    bearerToken: googleUser.bearerToken
  };
}

export async function mockListItems(bearerToken: string | null): Promise<ItemsPayload> {
  await sleep(mockDelay);
  return {
    items: getAccessibleItems(getSessionByBearer(bearerToken))
  };
}

export async function mockCreateItem(
  bearerToken: string | null,
  input: ItemInput
): Promise<ItemRecord> {
  await sleep(mockDelay);
  const session = requireSession(bearerToken);
  const database = readDemoDatabase();
  const now = new Date().toISOString();

  const item: ItemRecord = {
    id: generateId("item"),
    ownerId: session.id,
    title: input.title,
    summary: input.summary,
    visibility: input.visibility,
    isPinned: input.isPinned,
    createdAt: now,
    updatedAt: now
  };

  database.items.unshift(item);
  writeDemoDatabase(database);
  return item;
}

export async function mockUpdateItem(
  bearerToken: string | null,
  id: string,
  input: ItemInput
): Promise<ItemRecord> {
  await sleep(mockDelay);
  const session = requireSession(bearerToken);
  const database = readDemoDatabase();
  const item = database.items.find((entry) => entry.id === id);

  if (!item) {
    throw new Error("NOT_FOUND");
  }

  if (item.ownerId !== session.id) {
    throw new Error("FORBIDDEN");
  }

  item.title = input.title;
  item.summary = input.summary;
  item.visibility = input.visibility;
  item.isPinned = input.isPinned;
  item.updatedAt = new Date().toISOString();

  writeDemoDatabase(database);
  return item;
}

export async function mockDeleteItem(bearerToken: string | null, id: string) {
  await sleep(mockDelay);
  const session = requireSession(bearerToken);
  const database = readDemoDatabase();
  const index = database.items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new Error("NOT_FOUND");
  }

  if (database.items[index]?.ownerId !== session.id) {
    throw new Error("FORBIDDEN");
  }

  database.items.splice(index, 1);
  writeDemoDatabase(database);
  return { id };
}

export async function mockGetProfile(bearerToken: string | null): Promise<ProfilePayload> {
  await sleep(mockDelay);
  const session = requireSession(bearerToken);
  const database = readDemoDatabase();
  const profile = database.profiles.find((entry) => entry.userId === session.id);
  if (!profile) {
    throw new Error("NOT_FOUND");
  }

  return { profile };
}

export async function mockUpdateProfile(
  bearerToken: string | null,
  input: AppPreferenceInput
): Promise<ProfilePayload> {
  await sleep(mockDelay);
  const session = requireSession(bearerToken);
  const database = readDemoDatabase();
  const profile = database.profiles.find((entry) => entry.userId === session.id);
  if (!profile) {
    throw new Error("NOT_FOUND");
  }

  profile.displayName = input.displayName;
  profile.avatarUrl = input.avatarUrl;
  profile.language = input.language;
  profile.theme = input.theme;
  profile.updatedAt = new Date().toISOString();
  writeDemoDatabase(database);

  const sessionRecord = demoSessions.find((entry) => entry.id === session.id);
  if (sessionRecord) {
    sessionRecord.displayName = input.displayName;
    sessionRecord.avatarUrl = input.avatarUrl;
    sessionRecord.language = input.language;
    sessionRecord.theme = input.theme;
  }

  return { profile };
}

export function mockReset() {
  resetDemoDatabase();
}
