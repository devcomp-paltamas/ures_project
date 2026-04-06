import { mockBootstrap } from "@/api/mock-api";
import { httpGet } from "@/api/http";
import { env } from "@/lib/env";
import type { BootstrapPayload } from "@/types/domain";

export async function getBootstrapData() {
  if (env.authMode === "mock") {
    return mockBootstrap();
  }

  return httpGet<BootstrapPayload>("/api/bootstrap");
}
