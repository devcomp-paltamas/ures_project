import { appConfig } from "@/lib/constants";
import type {
  DemoDatabaseShape,
  ItemRecord,
  LandingBlock,
  ProfileRecord,
  UserSession
} from "@/types/domain";

const now = new Date().toISOString();

export const demoProfiles: ProfileRecord[] = [
  {
    userId: "user_alma",
    email: "alma@example.com",
    displayName: "Alma Horvath",
    avatarUrl: null,
    language: "hu",
    theme: "system",
    createdAt: now,
    updatedAt: now
  },
  {
    userId: "user_noah",
    email: "noah@example.com",
    displayName: "Noah Clark",
    avatarUrl: null,
    language: "en",
    theme: "dark",
    createdAt: now,
    updatedAt: now
  }
];

export const demoSessions: Array<
  UserSession & {
    password: string;
    bearerToken: string;
  }
> = [
  {
    id: "user_alma",
    email: "alma@example.com",
    displayName: "Alma Horvath",
    avatarUrl: null,
    language: "hu",
    theme: "system",
    provider: "password",
    password: "Demo1234!",
    bearerToken: appConfig.mockBearerToken
  },
  {
    id: "user_noah",
    email: "noah@example.com",
    displayName: "Noah Clark",
    avatarUrl: null,
    language: "en",
    theme: "dark",
    provider: "google",
    password: "Demo1234!",
    bearerToken: "demo-google-token"
  }
];

export const demoLandingBlocks: LandingBlock[] = [
  {
    id: "block_hero_flow",
    slug: "live-ops-ready",
    eyebrow: "Operational shell",
    title: "Clean SPA layout with room for later brand direction.",
    body: "Typography, spacing and surfaces are already separated from content so a later design system can replace the visuals without reworking the app structure.",
    tone: "signal",
    ctaLabel: "Open dashboard",
    ctaHref: "/app",
    isPublished: true,
    createdAt: now
  },
  {
    id: "block_auth_stack",
    slug: "auth-ready",
    eyebrow: "Auth stack",
    title: "Firebase handles the session, Supabase keeps the data model.",
    body: "The starter is prepared for email/password login, Google login, bearer-token API calls and a later RLS-aligned database flow.",
    tone: "focus",
    ctaLabel: "View components",
    ctaHref: "#component-showcase",
    isPublished: true,
    createdAt: now
  },
  {
    id: "block_delivery",
    slug: "ship-fast",
    eyebrow: "Delivery path",
    title: "Vercel, Playwright and Vitest are part of the default structure.",
    body: "The repository is prepared for preview and production environments, local quality gates and later CI automation.",
    tone: "calm",
    ctaLabel: "Review setup",
    ctaHref: "#setup",
    isPublished: true,
    createdAt: now
  }
];

export const demoItems: ItemRecord[] = [
  {
    id: "item_roadmap",
    ownerId: "user_alma",
    title: "Brand workshop notes",
    summary:
      "Private draft block used as a safe space for early concept notes.",
    visibility: "private",
    isPinned: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item_onboarding",
    ownerId: "user_alma",
    title: "Shared onboarding checklist",
    summary: "Visible to signed-in users, but editable only by the owner.",
    visibility: "members",
    isPinned: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item_release",
    ownerId: "user_noah",
    title: "Public release message",
    summary: "Public example entry that also appears on the landing feed.",
    visibility: "public",
    isPinned: false,
    createdAt: now,
    updatedAt: now
  }
];

export function createDemoDatabase(): DemoDatabaseShape {
  return {
    profiles: structuredClone(demoProfiles),
    landingBlocks: structuredClone(demoLandingBlocks),
    items: structuredClone(demoItems)
  };
}
