import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";
import { storageKeys } from "@/lib/constants";
import { renderWithProviders } from "@/test-utils/render";

describe("SiteHeader locale switch", () => {
  it("átvált angol nyelvre a fejléc menüből", async () => {
    window.localStorage.removeItem(storageKeys.session);
    window.localStorage.removeItem(storageKeys.language);

    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);

    expect(screen.getByRole("button", { name: /magyar/i })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /magyar/i }));
    await user.click(await screen.findByText("Angol"));

    expect(await screen.findByRole("button", { name: /english/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeTruthy();
  });
});
