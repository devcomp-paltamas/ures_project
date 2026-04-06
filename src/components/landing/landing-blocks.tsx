import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/providers/i18n-provider";
import type { LandingBlock } from "@/types/domain";
import { cn } from "@/lib/utils";

const toneClassMap = {
  signal: "bg-secondary/60",
  calm: "bg-background/80",
  focus: "bg-accent/20"
} as const;

export function LandingBlocks({
  blocks,
  isLoading
}: {
  blocks: LandingBlock[];
  isLoading: boolean;
}) {
  const { t } = useI18n();

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Badge variant="outline">{t("landing.sectionTitle")}</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            {t("landing.sectionTitle")}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {t("landing.sectionBody")}
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[2rem] border border-border/70 p-6"
                >
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-5 h-8 w-4/5" />
                  <Skeleton className="mt-4 h-24 w-full" />
                </div>
              ))
            : blocks.map((block, index) => (
                <Card
                  className={cn(
                    "overflow-hidden border-border/70",
                    toneClassMap[block.tone],
                    index === 0 && "lg:row-span-2"
                  )}
                  key={block.id}
                >
                  <CardHeader>
                    <Badge
                      variant={block.tone === "focus" ? "accent" : "outline"}
                      className="w-fit"
                    >
                      {block.eyebrow}
                    </Badge>
                    <CardTitle className="max-w-lg text-2xl">
                      {block.title}
                    </CardTitle>
                    <CardDescription className="max-w-lg text-sm leading-6">
                      {block.body}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span>{block.ctaLabel}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
