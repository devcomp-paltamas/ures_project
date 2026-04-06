import { mockGetProfile, mockUpdateProfile } from "@/api/mock-api";
import { httpGet, httpPatch } from "@/api/http";
import { env } from "@/lib/env";
import type { AppPreferenceInput, ProfilePayload } from "@/types/domain";

function shouldUseMockApi() {
  return env.authMode === "mock";
}

export async function getProfile(bearerToken: string | null) {
  if (shouldUseMockApi()) {
    return mockGetProfile(bearerToken);
  }

  return httpGet<ProfilePayload>("/api/preferences", bearerToken);
}

export async function updateProfilePreferences(
  bearerToken: string | null,
  input: AppPreferenceInput
) {
  if (shouldUseMockApi()) {
    return mockUpdateProfile(bearerToken, input);
  }

  return httpPatch<AppPreferenceInput, ProfilePayload>("/api/preferences", input, bearerToken);
}
