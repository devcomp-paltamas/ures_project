import { RouteState } from "@/components/common/route-state";
import { useI18n } from "@/providers/use-i18n";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <RouteState
      body={t("state.notFoundBody")}
      ctaLabel={t("common.goHome")}
      ctaTo="/"
      title={t("state.notFoundTitle")}
    />
  );
}
