import type { PostgrestError } from "@supabase/supabase-js";
import type {
  AppPreferenceInput,
  AuthProvider,
  BootstrapPayload,
  ItemInput,
  ItemRecord,
  LandingBlock,
  ProfileRecord,
  UserSession
} from "@/types/domain";
import { ApiError } from "./errors";
import {
  createItemForSession as createDemoItemForSession,
  deleteItemForSession as deleteDemoItemForSession,
  ensureProfileSession as ensureDemoProfileSession,
  getBootstrapPayload as getDemoBootstrapPayload,
  getProfileForSession as getDemoProfileForSession,
  listItemsForSession as listDemoItemsForSession,
  updateItemForSession as updateDemoItemForSession,
  updateProfileForSession as updateDemoProfileForSession
} from "./demo-store";
import { getSupabaseAdminClient, isSupabaseServerConfigured } from "./supabase";

interface AuthIdentity {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  provider: AuthProvider;
}

interface ProfileRow {
  user_id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  language: "hu" | "en";
  theme: "light" | "dark" | "system";
  created_at: string;
  updated_at: string;
}

interface ItemRow {
  id: string;
  owner_id: string;
  title: string;
  summary: string;
  visibility: "private" | "members" | "public";
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface LandingBlockRow {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  body: string;
  tone: "signal" | "calm" | "focus";
  cta_label: string;
  cta_href: string;
  is_published: boolean;
  created_at: string;
}

function shouldUseDemoRepository() {
  return !isSupabaseServerConfigured();
}

function requireSupabase() {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new ApiError(
      500,
      "Supabase server configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return client;
}

function handleSupabaseError(error: PostgrestError | null, fallbackMessage: string) {
  if (!error) {
    return;
  }

  throw new ApiError(500, `${fallbackMessage} (${error.message})`);
}

function mapProfile(row: ProfileRow): ProfileRecord {
  return {
    userId: row.user_id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    language: row.language,
    theme: row.theme,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSession(row: ProfileRow, provider: AuthProvider): UserSession {
  return {
    id: row.user_id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    language: row.language,
    theme: row.theme,
    provider
  };
}

function mapItem(row: ItemRow): ItemRecord {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    summary: row.summary,
    visibility: row.visibility,
    isPinned: row.is_pinned,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapLandingBlock(row: LandingBlockRow): LandingBlock {
  return {
    id: row.id,
    slug: row.slug,
    eyebrow: row.eyebrow,
    title: row.title,
    body: row.body,
    tone: row.tone,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    isPublished: row.is_published,
    createdAt: row.created_at
  };
}

function getProfileUpsertPayload(identity: AuthIdentity, existing: ProfileRow | null) {
  return {
    user_id: identity.id,
    email: identity.email,
    display_name: existing?.display_name || identity.displayName,
    avatar_url: existing?.avatar_url ?? identity.avatarUrl,
    language: existing?.language ?? "hu",
    theme: existing?.theme ?? "system"
  };
}

export async function ensureProfileSession(identity: AuthIdentity) {
  if (shouldUseDemoRepository()) {
    return ensureDemoProfileSession(identity);
  }

  const supabase = requireSupabase();
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, email, display_name, avatar_url, language, theme, created_at, updated_at")
    .eq("user_id", identity.id)
    .maybeSingle<ProfileRow>();

  handleSupabaseError(profileError, "Failed to read profile");

  const payload = getProfileUpsertPayload(identity, existingProfile);
  const { data: upsertedProfile, error: upsertError } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select("user_id, email, display_name, avatar_url, language, theme, created_at, updated_at")
    .single<ProfileRow>();

  handleSupabaseError(upsertError, "Failed to upsert profile");
  return mapSession(upsertedProfile, identity.provider);
}

export async function getBootstrapPayload() {
  if (shouldUseDemoRepository()) {
    return getDemoBootstrapPayload();
  }

  const supabase = requireSupabase();
  const [{ data: landingRows, error: landingError }, { data: itemRows, error: itemError }] =
    await Promise.all([
      supabase
        .from("landing_blocks")
        .select("id, slug, eyebrow, title, body, tone, cta_label, cta_href, is_published, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: true })
        .returns<LandingBlockRow[]>(),
      supabase
        .from("items")
        .select("id, owner_id, title, summary, visibility, is_pinned, created_at, updated_at")
        .eq("visibility", "public")
        .order("updated_at", { ascending: false })
        .returns<ItemRow[]>()
    ]);

  handleSupabaseError(landingError, "Failed to load landing blocks");
  handleSupabaseError(itemError, "Failed to load public items");

  return {
    landingBlocks: (landingRows ?? []).map(mapLandingBlock),
    publicItems: (itemRows ?? []).map(mapItem)
  } satisfies BootstrapPayload;
}

export async function listItemsForSession(session: UserSession | null) {
  if (shouldUseDemoRepository()) {
    return listDemoItemsForSession(session);
  }

  const supabase = requireSupabase();
  const baseQuery = supabase
    .from("items")
    .select("id, owner_id, title, summary, visibility, is_pinned, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (!session) {
    const { data, error } = await baseQuery.eq("visibility", "public").returns<ItemRow[]>();
    handleSupabaseError(error, "Failed to list public items");
    return { items: (data ?? []).map(mapItem) };
  }

  const { data, error } = await baseQuery
    .or(`owner_id.eq.${session.id},visibility.eq.members,visibility.eq.public`)
    .returns<ItemRow[]>();

  handleSupabaseError(error, "Failed to list items");
  return { items: (data ?? []).map(mapItem) };
}

export async function getProfileForSession(session: UserSession) {
  if (shouldUseDemoRepository()) {
    return getDemoProfileForSession(session);
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, email, display_name, avatar_url, language, theme, created_at, updated_at")
    .eq("user_id", session.id)
    .single<ProfileRow>();

  if (error?.code === "PGRST116") {
    throw new ApiError(404, "Profile not found.");
  }

  handleSupabaseError(error, "Failed to load profile");
  return { profile: mapProfile(data) };
}

export async function updateProfileForSession(session: UserSession, input: AppPreferenceInput) {
  if (shouldUseDemoRepository()) {
    return updateDemoProfileForSession(session, input);
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: input.displayName,
      avatar_url: input.avatarUrl,
      language: input.language,
      theme: input.theme
    })
    .eq("user_id", session.id)
    .select("user_id, email, display_name, avatar_url, language, theme, created_at, updated_at")
    .single<ProfileRow>();

  if (error?.code === "PGRST116") {
    throw new ApiError(404, "Profile not found.");
  }

  handleSupabaseError(error, "Failed to update profile");
  return { profile: mapProfile(data) };
}

export async function createItemForSession(session: UserSession, input: ItemInput) {
  if (shouldUseDemoRepository()) {
    return createDemoItemForSession(session, input);
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("items")
    .insert({
      owner_id: session.id,
      title: input.title,
      summary: input.summary,
      visibility: input.visibility,
      is_pinned: input.isPinned
    })
    .select("id, owner_id, title, summary, visibility, is_pinned, created_at, updated_at")
    .single<ItemRow>();

  handleSupabaseError(error, "Failed to create item");
  return mapItem(data);
}

async function getExistingItem(itemId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("items")
    .select("id, owner_id, title, summary, visibility, is_pinned, created_at, updated_at")
    .eq("id", itemId)
    .maybeSingle<ItemRow>();

  handleSupabaseError(error, "Failed to load item");
  return data;
}

export async function updateItemForSession(session: UserSession, itemId: string, input: ItemInput) {
  if (shouldUseDemoRepository()) {
    return updateDemoItemForSession(session, itemId, input);
  }

  const existing = await getExistingItem(itemId);
  if (!existing) {
    throw new ApiError(404, "Item not found.");
  }

  if (existing.owner_id !== session.id) {
    throw new ApiError(403, "Only the owner can modify this item.");
  }

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("items")
    .update({
      title: input.title,
      summary: input.summary,
      visibility: input.visibility,
      is_pinned: input.isPinned
    })
    .eq("id", itemId)
    .eq("owner_id", session.id)
    .select("id, owner_id, title, summary, visibility, is_pinned, created_at, updated_at")
    .single<ItemRow>();

  handleSupabaseError(error, "Failed to update item");
  return mapItem(data);
}

export async function deleteItemForSession(session: UserSession, itemId: string) {
  if (shouldUseDemoRepository()) {
    return deleteDemoItemForSession(session, itemId);
  }

  const existing = await getExistingItem(itemId);
  if (!existing) {
    throw new ApiError(404, "Item not found.");
  }

  if (existing.owner_id !== session.id) {
    throw new ApiError(403, "Only the owner can modify this item.");
  }

  const supabase = requireSupabase();
  const { error } = await supabase.from("items").delete().eq("id", itemId).eq("owner_id", session.id);
  handleSupabaseError(error, "Failed to delete item");
  return { id: itemId };
}
