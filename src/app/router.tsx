import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { RouteErrorBoundary } from "@/components/common/route-error-boundary";
import { ComponentsPage } from "@/app/pages/components-page";
import { DashboardPage } from "@/app/pages/dashboard-page";
import { LandingPage } from "@/app/pages/landing-page";
import { NotFoundPage } from "@/app/pages/not-found-page";

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    element: <MarketingLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/components",
        element: <ComponentsPage />
      }
    ]
  },
  {
    errorElement: <RouteErrorBoundary />,
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/app",
            element: <DashboardPage />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <RouteErrorBoundary />
  }
]);
