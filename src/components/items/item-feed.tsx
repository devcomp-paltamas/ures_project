import { useDeferredValue, useMemo, useState } from "react";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import type { ItemRecord } from "@/types/domain";
import { formatDate } from "@/lib/utils";

type FeedFilter = "all" | "mine" | "shared" | "public";

export function ItemFeed({
  items,
  isLoading
}: {
  items: ItemRecord[];
  isLoading: boolean;
}) {
  const { t, locale } = useI18n();
  const { session } = useAuth();
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "mine"
            ? item.ownerId === session?.id
            : filter === "shared"
              ? item.visibility === "members"
              : item.visibility === "public";

      const matchesSearch =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.summary.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [deferredSearch, filter, items, session?.id]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t("dashboard.title")}</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">{t("dashboard.body")}</p>
        </div>
        <div className="w-full max-w-md">
          <Input
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("common.searchPlaceholder")}
            value={search}
          />
        </div>
      </div>

      <Tabs
        onValueChange={(value) => setFilter(value as FeedFilter)}
        value={filter}
      >
        <TabsList>
          <TabsTrigger value="all">{t("dashboard.filterAll")}</TabsTrigger>
          <TabsTrigger value="mine">{t("dashboard.filterMine")}</TabsTrigger>
          <TabsTrigger value="shared">{t("dashboard.filterShared")}</TabsTrigger>
          <TabsTrigger value="public">{t("dashboard.filterPublic")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton className="h-40 rounded-[2rem]" key={index} />
            ))
          : filteredItems.map((item) => (
              <Card className="border-border/70 bg-card/78" key={item.id}>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.isPinned ? (
                        <Badge variant="accent">
                          <Pin className="mr-1 h-3 w-3" />
                          {t("items.pinned")}
                        </Badge>
                      ) : null}
                      <VisibilityBadge visibility={item.visibility} />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="max-w-2xl text-sm leading-6">
                      {item.summary}
                    </CardDescription>
                  </div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {formatDate(item.updatedAt, locale)}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {t("common.owner")}:{" "}
                    <span className="font-medium text-foreground">
                      {item.ownerId === session?.id ? session.displayName : item.ownerId}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}

        {!isLoading && filteredItems.length === 0 ? (
          <Card className="border-dashed border-border/80 bg-background/55">
            <CardHeader>
              <CardTitle>{t("dashboard.emptyTitle")}</CardTitle>
              <CardDescription>{t("dashboard.emptyBody")}</CardDescription>
            </CardHeader>
          </Card>
        ) : null}
      </div>
    </section>
  );
}

function VisibilityBadge({ visibility }: { visibility: ItemRecord["visibility"] }) {
  const { t } = useI18n();

  if (visibility === "public") {
    return <Badge>{t("common.public")}</Badge>;
  }

  if (visibility === "members") {
    return <Badge variant="outline">{t("common.members")}</Badge>;
  }

  return <Badge variant="accent">{t("common.private")}</Badge>;
}
