import {
  useDeferredValue,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Pin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createItem,
  deleteItem,
  updateItem
} from "@/features/items/items-service";
import { useI18n } from "@/providers/use-i18n";
import { useAuth } from "@/providers/use-auth";
import type { ItemInput, ItemRecord, ItemVisibility } from "@/types/domain";
import { formatDate } from "@/lib/utils";

type FeedFilter = "all" | "mine" | "shared" | "public";
type ItemDraft = ItemInput;

function createEmptyDraft(): ItemDraft {
  return {
    titleI18n: {
      hu: "",
      en: ""
    },
    summaryI18n: {
      hu: "",
      en: ""
    },
    visibility: "private",
    isPinned: false
  };
}

function createDraftFromItem(item: ItemRecord): ItemDraft {
  return {
    titleI18n: item.titleI18n ?? {
      hu: item.title,
      en: item.title
    },
    summaryI18n: item.summaryI18n ?? {
      hu: item.summary,
      en: item.summary
    },
    visibility: item.visibility,
    isPinned: item.isPinned
  };
}

export function ItemFeed({
  bearerToken,
  items,
  isLoading
}: {
  bearerToken: string | null;
  items: ItemRecord[];
  isLoading: boolean;
}) {
  const { t, locale } = useI18n();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [search, setSearch] = useState("");
  const [createDraft, setCreateDraft] = useState<ItemDraft>(() =>
    createEmptyDraft()
  );
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemRecord | null>(null);
  const [editDraft, setEditDraft] = useState<ItemDraft>(() =>
    createEmptyDraft()
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  async function refreshItemQueries(visibility: ItemVisibility) {
    await queryClient.invalidateQueries({
      queryKey: ["items", bearerToken]
    });

    if (visibility === "public") {
      await queryClient.invalidateQueries({
        queryKey: ["bootstrap"]
      });
    }
  }

  function patchCreateDraft(next: Partial<ItemDraft>) {
    setCreateDraft((current) => ({
      ...current,
      ...next
    }));
  }

  function patchEditDraft(next: Partial<ItemDraft>) {
    setEditDraft((current) => ({
      ...current,
      ...next
    }));
  }

  function openEditDialog(item: ItemRecord) {
    setEditingItem(item);
    setEditDraft(createDraftFromItem(item));
  }

  function closeEditDialog() {
    setEditingItem(null);
    setEditDraft(createEmptyDraft());
  }

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      return;
    }

    setIsCreating(true);
    try {
      const created = await createItem(bearerToken, createDraft);
      await refreshItemQueries(created.visibility);
      setCreateDraft(createEmptyDraft());
      toast.success(t("items.created"));
    } catch {
      toast.error(t("items.error"));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingItem) {
      return;
    }

    setIsUpdating(true);
    try {
      const previousVisibility = editingItem.visibility;
      const updated = await updateItem(bearerToken, editingItem.id, editDraft);
      await refreshItemQueries(previousVisibility);
      if (updated.visibility !== previousVisibility) {
        await refreshItemQueries(updated.visibility);
      }
      closeEditDialog();
      toast.success(t("items.updated"));
    } catch {
      toast.error(t("items.error"));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(item: ItemRecord) {
    setDeletingItemId(item.id);
    try {
      await deleteItem(bearerToken, item.id);
      await refreshItemQueries(item.visibility);
      toast.success(t("items.deleted"));
      if (editingItem?.id === item.id) {
        closeEditDialog();
      }
    } catch {
      toast.error(t("items.error"));
    } finally {
      setDeletingItemId(null);
    }
  }

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
      <Card className="border-border/70 bg-background/82">
        <CardHeader>
          <Badge variant="outline">{t("items.editorCreateTitle")}</Badge>
          <CardTitle>{t("dashboard.createTitle")}</CardTitle>
          <CardDescription>{t("items.editorCreateBody")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemEditorForm
            draft={createDraft}
            isPending={isCreating}
            onChange={patchCreateDraft}
            onSubmit={(event) => {
              void handleCreateSubmit(event);
            }}
            pendingLabel={t("items.createPending")}
            submitLabel={t("items.createSubmit")}
            tertiaryAction={
              <Button
                onClick={() => setCreateDraft(createEmptyDraft())}
                type="button"
                variant="ghost"
              >
                {t("items.resetDraft")}
              </Button>
            }
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("dashboard.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
            {t("dashboard.body")}
          </p>
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
          <TabsTrigger value="shared">
            {t("dashboard.filterShared")}
          </TabsTrigger>
          <TabsTrigger value="public">
            {t("dashboard.filterPublic")}
          </TabsTrigger>
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
                  <div className="flex items-start gap-2">
                    <p className="pt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {formatDate(item.updatedAt, locale)}
                    </p>
                    {item.ownerId === session?.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => openEditDialog(item)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <Pencil className="h-4 w-4" />
                          {t("items.editAction")}
                        </Button>
                        <Button
                          onClick={() => {
                            void handleDelete(item);
                          }}
                          disabled={deletingItemId === item.id}
                          size="sm"
                          type="button"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("common.delete")}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {t("common.owner")}:{" "}
                    <span className="font-medium text-foreground">
                      {item.ownerId === session?.id
                        ? session.displayName
                        : item.ownerId}
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

      <Dialog
        onOpenChange={(open) => !open && closeEditDialog()}
        open={Boolean(editingItem)}
      >
        <DialogContent>
          <DialogHeader>
            <Badge variant="outline">{t("items.editorEditTitle")}</Badge>
            <DialogTitle>{t("items.editorEditTitle")}</DialogTitle>
            <DialogDescription>{t("items.editorEditBody")}</DialogDescription>
          </DialogHeader>
          <ItemEditorForm
            draft={editDraft}
            isPending={isUpdating}
            onChange={patchEditDraft}
            onSubmit={(event) => {
              void handleUpdateSubmit(event);
            }}
            pendingLabel={t("items.updatePending")}
            submitLabel={t("items.updateSubmit")}
            tertiaryAction={
              editingItem ? (
                <Button
                  onClick={() => {
                    void handleDelete(editingItem);
                  }}
                  disabled={deletingItemId === editingItem.id || isUpdating}
                  type="button"
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("common.delete")}
                </Button>
              ) : null
            }
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ItemEditorForm({
  draft,
  isPending,
  onChange,
  onSubmit,
  pendingLabel,
  submitLabel,
  tertiaryAction
}: {
  draft: ItemDraft;
  isPending: boolean;
  onChange: (next: Partial<ItemDraft>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pendingLabel: string;
  submitLabel: string;
  tertiaryAction?: ReactNode;
}) {
  const { t } = useI18n();

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4 rounded-[1.75rem] border border-border/70 bg-secondary/38 p-5">
          <div className="space-y-2">
            <Label htmlFor="title-hu">{t("items.titleHuLabel")}</Label>
            <Input
              id="title-hu"
              onChange={(event) =>
                onChange({
                  titleI18n: {
                    ...draft.titleI18n,
                    hu: event.target.value
                  }
                })
              }
              required
              value={draft.titleI18n.hu}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary-hu">{t("items.summaryHuLabel")}</Label>
            <Textarea
              id="summary-hu"
              onChange={(event) =>
                onChange({
                  summaryI18n: {
                    ...draft.summaryI18n,
                    hu: event.target.value
                  }
                })
              }
              required
              value={draft.summaryI18n.hu}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background/72 p-5">
          <div className="space-y-2">
            <Label htmlFor="title-en">{t("items.titleEnLabel")}</Label>
            <Input
              id="title-en"
              onChange={(event) =>
                onChange({
                  titleI18n: {
                    ...draft.titleI18n,
                    en: event.target.value
                  }
                })
              }
              required
              value={draft.titleI18n.en}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary-en">{t("items.summaryEnLabel")}</Label>
            <Textarea
              id="summary-en"
              onChange={(event) =>
                onChange({
                  summaryI18n: {
                    ...draft.summaryI18n,
                    en: event.target.value
                  }
                })
              }
              required
              value={draft.summaryI18n.en}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-[1.75rem] border border-border/70 bg-background/72 p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="item-visibility">
              {t("items.visibilityLabel")}
            </Label>
            <Select
              onValueChange={(value) =>
                onChange({ visibility: value as ItemVisibility })
              }
              value={draft.visibility}
            >
              <SelectTrigger id="item-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">{t("common.private")}</SelectItem>
                <SelectItem value="members">{t("common.members")}</SelectItem>
                <SelectItem value="public">{t("common.public")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {draft.visibility === "public"
                ? t("items.visibilityHintPublic")
                : draft.visibility === "members"
                  ? t("items.visibilityHintMembers")
                  : t("items.visibilityHintPrivate")}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-[1.25rem] border border-border/70 bg-secondary/35 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("items.pinnedLabel")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("items.ownerOnly")}
              </p>
            </div>
            <Switch
              checked={draft.isPinned}
              onCheckedChange={(checked) =>
                onChange({ isPinned: Boolean(checked) })
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {tertiaryAction}
          <Button disabled={isPending} type="submit">
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

function VisibilityBadge({
  visibility
}: {
  visibility: ItemRecord["visibility"];
}) {
  const { t } = useI18n();

  if (visibility === "public") {
    return <Badge>{t("common.public")}</Badge>;
  }

  if (visibility === "members") {
    return <Badge variant="outline">{t("common.members")}</Badge>;
  }

  return <Badge variant="accent">{t("common.private")}</Badge>;
}
