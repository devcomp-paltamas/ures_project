import { mockBootstrap } from "@/api/mock-api";
import { httpGet } from "@/api/http";
import { env } from "@/lib/env";
import type { BootstrapPayload, Locale } from "@/types/domain";

export async function getBootstrapData(locale: Locale) {
  if (env.authMode === "mock") {
    return mockBootstrap(locale);
  }

  return httpGet<BootstrapPayload>(`/api/bootstrap?locale=${locale}`);
}
