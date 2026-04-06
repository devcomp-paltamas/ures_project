import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LandingPage } from "@/app/pages/landing-page";
import { renderWithProviders } from "@/test-utils/render";
import { storageKeys } from "@/lib/constants";
import { demoItems, demoLandingBlocks } from "@/lib/demo-data";

vi.mock("@/hooks/use-bootstrap-query", () => ({
  useBootstrapQuery: () => ({
    data: {
      landingBlocks: demoLandingBlocks,
      publicItems: demoItems.filter((item) => item.visibility === "public")
    },
    isLoading: false
  })
}));

describe("LandingPage", () => {
  it("megjeleniti a landing fo reszeit", async () => {
    window.localStorage.removeItem(storageKeys.language);
    renderWithProviders(<LandingPage />);

    expect(
      Boolean(
        await screen.findByText(
          "Gyors indulás valós auth, adatbázis és teszt réteggel."
        )
      )
    ).toBe(true);
    expect(
      screen.getAllByText("Belépés ugyanerről az oldalról").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Publikus minták adatbázisból").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Publikus release üzenet")).toBeTruthy();
    expect(screen.getAllByText("Komponens bemutató").length).toBeGreaterThan(0);
  });

  it("angol nyelvi preferenciaval angol feliratokat renderel", async () => {
    window.localStorage.setItem(storageKeys.language, "en");

    renderWithProviders(<LandingPage />);

    expect(
      Boolean(
        await screen.findByText(
          "Start fast with real auth, database and test layers."
        )
      )
    ).toBe(true);
    expect(
      screen.getAllByText("Sign in directly from the landing page").length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Public examples from the database").length
    ).toBeGreaterThan(0);
  });
});
