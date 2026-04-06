import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComponentsPage } from "@/app/pages/components-page";
import { renderWithProviders } from "@/test-utils/render";

describe("ComponentsPage", () => {
  it("renderel es lebonthato hiba nelkul", async () => {
    const view = renderWithProviders(<ComponentsPage />, "/components");

    expect(Boolean(await screen.findByText("Valós shadcn/ui showcase oldal"))).toBe(true);
    expect(screen.getAllByText("Accordion").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Checkbox").length).toBeGreaterThan(0);

    expect(() => view.unmount()).not.toThrow();
  });
});
