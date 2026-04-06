import { ArrowRight, Database, LayoutPanelTop, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";

const icons = [LayoutPanelTop, Database, Shield] as const;

export function LandingPageStory() {
  const { t } = useI18n();

  const items = [
    {
      title: t("landing.samplePagePrimary"),
      body: t("landing.flowBody")
    },
    {
      title: t("landing.samplePageSecondary"),
      body: t("landing.sectionBody")
    },
    {
      title: t("landing.samplePageTertiary"),
      body: t("landing.authBody")
    }
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2.6rem] border border-border/70 bg-card/70 p-6 shadow-[0_24px_90px_rgba(16,24,40,0.08)] sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <Badge variant="outline">{t("landing.flowTitle")}</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              {t("landing.samplePageTitle")}
            </h2>
            <p className="text-base leading-7 text-muted-foreground">{t("landing.samplePageBody")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item, index) => {
              const Icon = icons[index];
              return (
                <Card className="border-border/70 bg-background/72" key={item.title}>
                  <CardHeader>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">{item.body}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm font-medium text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      {t("common.appName")}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
