import { beforeEach, describe, expect, it } from "vitest";
import {
  createItemForSession,
  getBootstrapPayload,
  getSessionByDemoBearerToken,
  listItemsForSession,
  resetDemoStore,
  updateProfileForSession
} from "./demo-store";

describe("demo api store", () => {
  beforeEach(() => {
    resetDemoStore();
  });

  it("returns only public bootstrap data", () => {
    const payload = getBootstrapPayload("hu");

    expect(payload.landingBlocks.length).toBeGreaterThan(0);
    expect(
      payload.publicItems.every((item) => item.visibility === "public")
    ).toBe(true);
    expect(payload.landingBlocks[0]?.eyebrow).toBe("Működő shell");
  });

  it("resolves bootstrap and list items in the requested locale", () => {
    const session = getSessionByDemoBearerToken("demo-bearer-token");
    if (!session) {
      throw new Error("Demo session missing.");
    }

    const bootstrapPayload = getBootstrapPayload("en");
    const itemsPayload = listItemsForSession(session, "en");

    expect(bootstrapPayload.landingBlocks[0]?.eyebrow).toBe(
      "Operational shell"
    );
    expect(bootstrapPayload.publicItems[0]?.title).toBe(
      "Public release message"
    );
    expect(
      itemsPayload.items.some((item) => item.title === "Brand workshop notes")
    ).toBe(true);
  });

  it("filters accessible items by session visibility", () => {
    const publicItems = listItemsForSession(null, "hu");
    const signedInSession = getSessionByDemoBearerToken("demo-bearer-token");

    expect(
      publicItems.items.every((item) => item.visibility === "public")
    ).toBe(true);
    expect(signedInSession).not.toBeNull();
    expect(
      listItemsForSession(signedInSession, "hu").items.length
    ).toBeGreaterThan(publicItems.items.length);
  });

  it("updates profile and creates items for the active user", () => {
    const session = getSessionByDemoBearerToken("demo-bearer-token");
    if (!session) {
      throw new Error("Demo session missing.");
    }

    const profileResult = updateProfileForSession(session, {
      displayName: "Updated Alma",
      avatarUrl: "https://example.com/avatar.png",
      language: "en",
      theme: "dark"
    });

    const createdItem = createItemForSession(session, {
      titleI18n: {
        hu: "Szerver elem",
        en: "Server item"
      },
      summaryI18n: {
        hu: "API store-on keresztül létrehozva",
        en: "Created through API store"
      },
      visibility: "members",
      isPinned: true
    });

    expect(profileResult.profile.displayName).toBe("Updated Alma");
    expect(createdItem.ownerId).toBe(session.id);
    expect(createdItem.isPinned).toBe(true);
    expect(createdItem.titleI18n?.en).toBe("Server item");
  });
});
