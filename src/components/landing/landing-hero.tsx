import { ArrowRight, Orbit, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";

export function LandingHero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <div className="animate-reveal-up relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-[#101828] px-6 py-10 text-white shadow-[0_24px_120px_rgba(16,24,40,0.28)] sm:px-10 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,211,106,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(43,182,115,0.24),transparent_24%)]" />
          <div className="relative max-w-3xl">
            <Badge className="bg-white/12 text-white hover:bg-white/12">
              {t("common.previewBadge")}
            </Badge>
            <div className="mt-6 flex items-start gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.36em] text-white/60">
                  uresalap
                </p>
                <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
                  {t("landing.title")}
                </h1>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/74 sm:text-lg">
              {t("landing.body")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-white text-[#101828] hover:bg-white/90"
              >
                <a href="#auth-panel">
                  {t("landing.primaryCta")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 bg-white/6 text-white hover:bg-white/10"
              >
                <Link to="/components">{t("landing.secondaryCta")}</Link>
              </Button>
            </div>
          </div>
        </div>

        <aside className="animate-reveal-up space-y-4 [animation-delay:120ms]">
          <div className="glass-surface animate-float-y rounded-[2.2rem] border border-border/70 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {t("landing.architectureTitle")}
              </span>
              <Orbit className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {t("landing.architectureBody")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[2rem] border border-border/70 bg-secondary/55 p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-foreground">
                {t("landing.stackTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("landing.stackBody")}
              </p>
            </div>
            <div className="rounded-[2rem] border border-border/70 bg-accent/25 p-5">
              <Sparkles className="h-5 w-5 text-foreground" />
              <p className="mt-3 text-sm font-semibold text-foreground">
                {t("landing.brandTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("landing.brandBody")}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
