export const locales = ["hu", "en"] as const;
export const themeModes = ["light", "dark", "system"] as const;
export const itemVisibilities = ["private", "members", "public"] as const;
export const authProviders = ["password", "google"] as const;

export type Locale = (typeof locales)[number];
export type ThemeMode = (typeof themeModes)[number];
export type ItemVisibility = (typeof itemVisibilities)[number];
export type AuthProvider = (typeof authProviders)[number];

export interface UserSession {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  language: Locale;
  theme: ThemeMode;
  provider: AuthProvider;
}

export interface ProfileRecord {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  language: Locale;
  theme: ThemeMode;
  createdAt: string;
  updatedAt: string;
}

export interface LandingBlock {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  body: string;
  tone: "signal" | "calm" | "focus";
  ctaLabel: string;
  ctaHref: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ItemRecord {
  id: string;
  ownerId: string;
  title: string;
  summary: string;
  visibility: ItemVisibility;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  session: UserSession;
  bearerToken: string;
}

export interface BootstrapPayload {
  landingBlocks: LandingBlock[];
  publicItems: ItemRecord[];
}

export interface ItemsPayload {
  items: ItemRecord[];
}

export interface ProfilePayload {
  profile: ProfileRecord;
}

export interface AppPreferenceInput {
  displayName: string;
  avatarUrl: string | null;
  language: Locale;
  theme: ThemeMode;
}

export interface ItemInput {
  title: string;
  summary: string;
  visibility: ItemVisibility;
  isPinned: boolean;
}

export interface DemoDatabaseShape {
  profiles: ProfileRecord[];
  landingBlocks: LandingBlock[];
  items: ItemRecord[];
}
