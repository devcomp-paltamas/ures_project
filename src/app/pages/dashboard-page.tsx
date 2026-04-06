import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemFeed } from "@/components/items/item-feed";
import { ProfilePreferencesPanel } from "@/components/preferences/profile-preferences-panel";
import { useItemsQuery } from "@/hooks/use-items-query";
import { useProfileQuery } from "@/hooks/use-profile-query";
import {
  getAuthProviderLabel,
  getLocaleLabel,
  getThemeLabel
} from "@/lib/i18n/helpers";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

export function DashboardPage() {
  const { bearerToken, isAuthenticated, session } = useAuth();
  const { locale, t } = useI18n();
  const { data, isLoading } = useItemsQuery(bearerToken, isAuthenticated);
  const { data: profileData, isLoading: isProfileLoading } = useProfileQuery(
    bearerToken,
    isAuthenticated
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-[#101828] text-white shadow-[0_24px_120px_rgba(16,24,40,0.24)]">
          <CardHeader>
            <Badge className="w-fit bg-white/12 text-white">{t("dashboard.introCardTitle")}</Badge>
            <CardTitle className="text-3xl">{session?.displayName}</CardTitle>
            <CardDescription className="max-w-2xl text-white/70">
              {t("dashboard.introCardBody")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Metric
              label={t("dashboard.metricSession")}
              value={getAuthProviderLabel(locale, session?.provider ?? "mock")}
            />
            <Metric
              label={t("common.language")}
              value={getLocaleLabel(locale, session?.language ?? "hu")}
            />
            <Metric
              label={t("common.theme")}
              value={getThemeLabel(locale, session?.theme ?? "system")}
            />
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-background/82">
          <CardHeader>
            <Badge variant="outline">{t("preferences.title")}</Badge>
            <CardTitle>{session?.email}</CardTitle>
            <CardDescription>{t("dashboard.profileNote")}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <ProfilePreferencesPanel
        bearerToken={bearerToken}
        isLoading={isProfileLoading}
        profile={profileData?.profile ?? null}
      />

      <ItemFeed isLoading={isLoading} items={data?.items ?? []} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-white/56">{label}</p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
