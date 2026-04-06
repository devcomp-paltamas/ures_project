import { AuthPanel } from "@/components/auth/auth-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";

export function LandingAuthSection() {
  const { t } = useI18n();

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="border-border/70 bg-secondary/58">
            <CardHeader>
              <Badge variant="outline">{t("landing.authTitle")}</Badge>
              <CardTitle>{t("landing.authTitle")}</CardTitle>
              <CardDescription>{t("landing.authBody")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {t("landing.authHint")}
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-background/82">
            <CardHeader>
              <Badge variant="accent">{t("landing.architectureTitle")}</Badge>
              <CardTitle>{t("landing.architectureTitle")}</CardTitle>
              <CardDescription>{t("landing.architectureBody")}</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <AuthPanel />
      </div>
    </section>
  );
}
