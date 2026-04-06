import { ComponentShowcase } from "@/components/landing/component-showcase";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useI18n } from "@/providers/use-i18n";

export function ComponentsPage() {
  const { t } = useI18n();

  return (
    <main className="pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.6rem] border border-border/70 bg-[#101828] px-6 py-8 text-white shadow-[0_24px_120px_rgba(16,24,40,0.24)] sm:px-8">
            <Badge className="bg-white/12 text-white hover:bg-white/12">
              {t("components.pageEyebrow")}
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("components.pageTitle")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
              {t("components.pageBody")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge className="bg-white/12 text-white">
                {t("components.officialBadgeOne")}
              </Badge>
              <Badge className="bg-white/12 text-white">
                {t("components.officialBadgeTwo")}
              </Badge>
              <Badge className="bg-white/12 text-white">
                {t("components.officialBadgeThree")}
              </Badge>
              <Badge className="bg-white/12 text-white">
                {t("components.officialBadgeFour")}
              </Badge>
              <Badge className="bg-white/12 text-white">
                {t("components.officialBadgeFive")}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-border/70 bg-background/82">
              <CardHeader>
                <CardTitle>{t("components.structureTitle")}</CardTitle>
                <CardDescription>
                  {t("components.structureBody")}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/70 bg-secondary/48">
              <CardHeader>
                <CardTitle>{t("components.sourceTitle")}</CardTitle>
                <CardDescription>{t("components.sourceBody")}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <a
                  className="font-medium text-foreground underline decoration-border underline-offset-4"
                  href="https://ui.shadcn.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t("components.sourceLinkLabel")}
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <ComponentShowcase />
    </main>
  );
}
