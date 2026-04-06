import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/common/loading-screen";
import { RouteState } from "@/components/common/route-state";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

export function ProtectedRoute() {
  const { isAuthenticated, isReady } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  if (!isReady) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (location.pathname !== "/app") {
      return <Navigate replace to="/" />;
    }

    return (
      <RouteState
        body={t("state.unauthorizedBody")}
        ctaLabel={t("common.goHome")}
        ctaTo="/"
        title={t("state.unauthorizedTitle")}
      />
    );
  }

  return <Outlet />;
}
