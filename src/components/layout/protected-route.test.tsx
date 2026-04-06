import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { renderWithProviders } from "@/test-utils/render";
import { storageKeys } from "@/lib/constants";

describe("ProtectedRoute", () => {
  it("vendegkent tiltja a vedett route-ot", async () => {
    window.localStorage.removeItem(storageKeys.session);

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<div>Private area</div>} />
        </Route>
      </Routes>,
      "/app"
    );

    expect(Boolean(await screen.findByText("Belépés szükséges"))).toBe(true);
    expect(screen.queryByText("Private area")).toBeNull();
  });
});
