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
    eyebrow: "Működő shell",
    eyebrowI18n: {
      hu: "Működő shell",
      en: "Operational shell"
    },
    title: "Tiszta SPA layout, későbbi brand iránynak is hagyott hellyel.",
    titleI18n: {
      hu: "Tiszta SPA layout, későbbi brand iránynak is hagyott hellyel.",
      en: "Clean SPA layout with room for later brand direction."
    },
    body: "A tipográfia, a spacing és a felületi logika már külön rétegben van, ezért később új vizuális rendszerre is átállhat az app szerkezeti törés nélkül.",
    bodyI18n: {
      hu: "A tipográfia, a spacing és a felületi logika már külön rétegben van, ezért később új vizuális rendszerre is átállhat az app szerkezeti törés nélkül.",
      en: "Typography, spacing and surfaces are already separated from content so a later design system can replace the visuals without reworking the app structure."
    },
    tone: "signal",
    ctaLabel: "Dashboard megnyitása",
    ctaLabelI18n: {
      hu: "Dashboard megnyitása",
      en: "Open dashboard"
    },
    ctaHref: "/app",
    isPublished: true,
    createdAt: now
  },
  {
    id: "block_auth_stack",
    slug: "auth-ready",
    eyebrow: "Auth réteg",
    eyebrowI18n: {
      hu: "Auth réteg",
      en: "Auth stack"
    },
    title: "A sessiont Firebase kezeli, az adatmodellt a Supabase tartja.",
    titleI18n: {
      hu: "A sessiont Firebase kezeli, az adatmodellt a Supabase tartja.",
      en: "Firebase handles the session, Supabase keeps the data model."
    },
    body: "A starter elő van készítve email/jelszó és Google belépésre, bearer-tokenes API hívásokra és egy későbbi RLS-hez igazított adatfolyamra.",
    bodyI18n: {
      hu: "A starter elő van készítve email/jelszó és Google belépésre, bearer-tokenes API hívásokra és egy későbbi RLS-hez igazított adatfolyamra.",
      en: "The starter is prepared for email/password login, Google login, bearer-token API calls and a later RLS-aligned database flow."
    },
    tone: "focus",
    ctaLabel: "Komponensek megnyitása",
    ctaLabelI18n: {
      hu: "Komponensek megnyitása",
      en: "View components"
    },
    ctaHref: "#component-showcase",
    isPublished: true,
    createdAt: now
  },
  {
    id: "block_delivery",
    slug: "ship-fast",
    eyebrow: "Szállítási út",
    eyebrowI18n: {
      hu: "Szállítási út",
      en: "Delivery path"
    },
    title: "A Vercel, a Playwright és a Vitest már a kiinduló struktúra része.",
    titleI18n: {
      hu: "A Vercel, a Playwright és a Vitest már a kiinduló struktúra része.",
      en: "Vercel, Playwright and Vitest are part of the default structure."
    },
    body: "A repository elő van készítve preview és production környezetre, helyi minőségi kapukra és későbbi CI automatizálásra is.",
    bodyI18n: {
      hu: "A repository elő van készítve preview és production környezetre, helyi minőségi kapukra és későbbi CI automatizálásra is.",
      en: "The repository is prepared for preview and production environments, local quality gates and later CI automation."
    },
    tone: "calm",
    ctaLabel: "Beállítás áttekintése",
    ctaLabelI18n: {
      hu: "Beállítás áttekintése",
      en: "Review setup"
    },
    ctaHref: "#setup",
    isPublished: true,
    createdAt: now
  }
];

export const demoItems: ItemRecord[] = [
  {
    id: "item_roadmap",
    ownerId: "user_alma",
    title: "Brand workshop jegyzetek",
    titleI18n: {
      hu: "Brand workshop jegyzetek",
      en: "Brand workshop notes"
    },
    summary:
      "Privát vázlatblokk a korai koncepciós jegyzetek biztonságos gyűjtésére.",
    summaryI18n: {
      hu: "Privát vázlatblokk a korai koncepciós jegyzetek biztonságos gyűjtésére.",
      en: "Private draft block used as a safe space for early concept notes."
    },
    visibility: "private",
    isPinned: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item_onboarding",
    ownerId: "user_alma",
    title: "Megosztott onboarding ellenőrzőlista",
    titleI18n: {
      hu: "Megosztott onboarding ellenőrzőlista",
      en: "Shared onboarding checklist"
    },
    summary:
      "A belépett felhasználók látják, de szerkeszteni csak a tulajdonos tudja.",
    summaryI18n: {
      hu: "A belépett felhasználók látják, de szerkeszteni csak a tulajdonos tudja.",
      en: "Visible to signed-in users, but editable only by the owner."
    },
    visibility: "members",
    isPinned: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "item_release",
    ownerId: "user_noah",
    title: "Publikus release üzenet",
    titleI18n: {
      hu: "Publikus release üzenet",
      en: "Public release message"
    },
    summary: "Publikus mintaelem, ami a landing feedben is megjelenik.",
    summaryI18n: {
      hu: "Publikus mintaelem, ami a landing feedben is megjelenik.",
      en: "Public example entry that also appears on the landing feed."
    },
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
