import {
  mockCreateItem,
  mockDeleteItem,
  mockListItems,
  mockUpdateItem
} from "@/api/mock-api";
import { httpDelete, httpGet, httpPatch, httpPost } from "@/api/http";
import { env } from "@/lib/env";
import type { ItemInput, ItemRecord, ItemsPayload } from "@/types/domain";

function shouldUseMockApi() {
  return env.authMode === "mock";
}

export async function listItems(bearerToken: string | null) {
  if (shouldUseMockApi()) {
    return mockListItems(bearerToken);
  }

  return httpGet<ItemsPayload>("/api/items", bearerToken);
}

export async function createItem(bearerToken: string | null, input: ItemInput) {
  if (shouldUseMockApi()) {
    return mockCreateItem(bearerToken, input);
  }

  return httpPost<ItemInput, ItemRecord>("/api/items", input, bearerToken);
}

export async function updateItem(bearerToken: string | null, id: string, input: ItemInput) {
  if (shouldUseMockApi()) {
    return mockUpdateItem(bearerToken, id, input);
  }

  return httpPatch<ItemInput, ItemRecord>(`/api/items/${id}`, input, bearerToken);
}

export async function deleteItem(bearerToken: string | null, id: string) {
  if (shouldUseMockApi()) {
    return mockDeleteItem(bearerToken, id);
  }

  return httpDelete<{ id: string }>(`/api/items/${id}`, bearerToken);
}
