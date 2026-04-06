import { ArrowRight, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/providers/i18n-provider";
import type { ItemRecord } from "@/types/domain";
import { formatDate } from "@/lib/utils";

export function PublicFeed({
  items,
  isLoading
}: {
  items: ItemRecord[];
  isLoading: boolean;
}) {
  const { t, locale } = useI18n();

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="accent">{t("landing.publicFeedTitle")}</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              {t("landing.publicFeedTitle")}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {t("landing.publicFeedBody")}
            </p>
          </div>
          <Button asChild className="rounded-full">
            <a href="#auth-panel">
              {t("landing.publicFeedCta")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton className="h-52 rounded-[2rem]" key={index} />
              ))
            : items.map((item) => (
                <Card
                  className="border-border/70 bg-background/82"
                  key={item.id}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <Badge>{t("common.public")}</Badge>
                      {item.isPinned ? (
                        <Badge variant="accent">
                          <Pin className="mr-1 h-3 w-3" />
                          {t("items.pinned")}
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {item.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="text-sm text-muted-foreground">
                      {t("items.publicOwnerLabel")}:{" "}
                      <span className="font-medium text-foreground">
                        {item.ownerId}
                      </span>
                    </div>
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {t("items.publicUpdatedLabel")}{" "}
                      {formatDate(item.updatedAt, locale)}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {!isLoading && items.length === 0 ? (
          <Card className="mt-6 border-dashed border-border/80 bg-background/60">
            <CardHeader>
              <CardTitle>{t("landing.publicFeedEmpty")}</CardTitle>
            </CardHeader>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
