import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/layout/site-header";

export function AppLayout() {
  return (
    <div className="min-h-screen pb-10">
      <SiteHeader compact />
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
