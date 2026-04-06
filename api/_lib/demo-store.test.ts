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
    const payload = getBootstrapPayload();

    expect(payload.landingBlocks.length).toBeGreaterThan(0);
    expect(
      payload.publicItems.every((item) => item.visibility === "public")
    ).toBe(true);
  });

  it("filters accessible items by session visibility", () => {
    const publicItems = listItemsForSession(null);
    const signedInSession = getSessionByDemoBearerToken("demo-bearer-token");

    expect(
      publicItems.items.every((item) => item.visibility === "public")
    ).toBe(true);
    expect(signedInSession).not.toBeNull();
    expect(listItemsForSession(signedInSession).items.length).toBeGreaterThan(
      publicItems.items.length
    );
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
      title: "Server item",
      summary: "Created through API store",
      visibility: "members",
      isPinned: true
    });

    expect(profileResult.profile.displayName).toBe("Updated Alma");
    expect(createdItem.ownerId).toBe(session.id);
    expect(createdItem.isPinned).toBe(true);
  });
});
