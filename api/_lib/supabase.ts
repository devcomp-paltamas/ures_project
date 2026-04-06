import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { serverEnv } from "./env";

let supabaseAdminClient: SupabaseClient | null | undefined;

export function isSupabaseServerConfigured() {
  return Boolean(serverEnv.supabase.url && serverEnv.supabase.serviceRoleKey);
}

export function getSupabaseAdminClient() {
  if (!isSupabaseServerConfigured()) {
    return null;
  }

  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  supabaseAdminClient = createClient(
    serverEnv.supabase.url,
    serverEnv.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  return supabaseAdminClient;
}
