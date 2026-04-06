import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/layout/site-header";

export function MarketingLayout() {
  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <Outlet />
    </div>
  );
}
