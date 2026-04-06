import {
  startTransition,
  useActionState,
  useOptimistic,
  useState
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormSubmitButton } from "@/components/common/form-submit-button";
import { UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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
import { useAuth } from "@/providers/use-auth";
import { useI18n } from "@/providers/use-i18n";
import { updateProfilePreferences } from "@/features/preferences/preferences-service";
import { getLocaleLabel, getThemeLabel } from "@/lib/i18n/helpers";
import type {
  AppPreferenceInput,
  Locale,
  ProfileRecord,
  ThemeMode
} from "@/types/domain";

interface ProfilePreferencesPanelProps {
  bearerToken: string | null;
  isLoading: boolean;
  profile: ProfileRecord | null;
}

interface ProfileActionState {
  status: "idle" | "success" | "error";
  message: string | null;
}

const initialActionState: ProfileActionState = {
  status: "idle",
  message: null
};

function createDraft(
  profile: ProfileRecord | null,
  fallback: NonNullable<ProfilePreferencesPanelProps["profile"]>
) {
  return {
    displayName: profile?.displayName ?? fallback.displayName,
    avatarUrl: profile?.avatarUrl ?? fallback.avatarUrl ?? "",
    language: profile?.language ?? fallback.language,
    theme: profile?.theme ?? fallback.theme
  };
}

export function ProfilePreferencesPanel({
  bearerToken,
  isLoading,
  profile
}: ProfilePreferencesPanelProps) {
  const { session, updateSession } = useAuth();
  const queryClient = useQueryClient();

  if (!session) {
    return null;
  }

  const fallbackProfile: ProfileRecord = profile ?? {
    userId: session.id,
    email: session.email,
    displayName: session.displayName,
    avatarUrl: session.avatarUrl,
    language: session.language,
    theme: session.theme,
    createdAt: "",
    updatedAt: ""
  };

  if (isLoading && !profile) {
    return (
      <Card className="border-border/70 bg-background/82">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-full" />
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Skeleton className="h-52 rounded-[2rem]" />
          <div className="space-y-4">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ProfilePreferencesForm
      bearerToken={bearerToken}
      fallbackProfile={fallbackProfile}
      key={`${fallbackProfile.userId}:${profile?.updatedAt ?? "initial"}`}
      onProfileSaved={(nextProfile) => {
        queryClient.setQueryData(["profile", bearerToken], {
          profile: nextProfile
        });
        startTransition(() => {
          updateSession({
            avatarUrl: nextProfile.avatarUrl,
            displayName: nextProfile.displayName,
            language: nextProfile.language,
            theme: nextProfile.theme
          });
        });
      }}
    />
  );
}

function ProfilePreferencesForm({
  bearerToken,
  fallbackProfile,
  onProfileSaved
}: {
  bearerToken: string | null;
  fallbackProfile: ProfileRecord;
  onProfileSaved: (nextProfile: ProfileRecord) => void;
}) {
  const { locale, t } = useI18n();
  const [draft, setDraft] = useState(() =>
    createDraft(fallbackProfile, fallbackProfile)
  );
  const [optimisticDraft, setOptimisticDraft] = useOptimistic(
    draft,
    (_current, next: typeof draft) => next
  );

  function patchDraft(next: Partial<typeof draft>) {
    const updated = { ...draft, ...next };
    setDraft(updated);
    setOptimisticDraft(updated);
  }

  const [state, submitAction] = useActionState<ProfileActionState, FormData>(
    async () => {
      const payload: AppPreferenceInput = {
        displayName: draft.displayName.trim(),
        avatarUrl: draft.avatarUrl.trim() || null,
        language: draft.language,
        theme: draft.theme
      };

      try {
        const result = await updateProfilePreferences(bearerToken, payload);
        onProfileSaved(result.profile);
        toast.success(t("preferences.updated"));

        return {
          status: "success",
          message: t("preferences.updated")
        };
      } catch {
        toast.error(t("preferences.error"));
        return {
          status: "error",
          message: t("preferences.error")
        };
      }
    },
    initialActionState
  );

  return (
    <Card className="border-border/70 bg-background/82">
      <CardHeader>
        <Badge variant="accent">{t("dashboard.profileTitle")}</Badge>
        <CardTitle>{t("dashboard.profileTitle")}</CardTitle>
        <CardDescription>{t("dashboard.profileBody")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
        <div className="rounded-[2rem] border border-border/80 bg-secondary/48 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {t("preferences.previewTitle")}
          </p>
          <div className="mt-5 flex items-center gap-4">
            <UserAvatar
              avatarUrl={optimisticDraft.avatarUrl || null}
              className="h-16 w-16"
              name={optimisticDraft.displayName || fallbackProfile.displayName}
            />
            <div>
              <p className="text-lg font-semibold text-foreground">
                {optimisticDraft.displayName || fallbackProfile.displayName}
              </p>
              <p className="text-sm text-muted-foreground">
                {fallbackProfile.email}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge>{getLocaleLabel(locale, optimisticDraft.language)}</Badge>
            <Badge variant="outline">
              {getThemeLabel(locale, optimisticDraft.theme)}
            </Badge>
          </div>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            {t("preferences.previewBody")}
          </p>
        </div>

        <form action={submitAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">
              {t("preferences.displayNameLabel")}
            </Label>
            <Input
              id="displayName"
              name="displayName"
              onChange={(event) =>
                patchDraft({ displayName: event.target.value })
              }
              value={draft.displayName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">{t("preferences.avatarLabel")}</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              onChange={(event) =>
                patchDraft({ avatarUrl: event.target.value })
              }
              placeholder={t("preferences.avatarPlaceholder")}
              value={draft.avatarUrl}
            />
            <p className="text-sm text-muted-foreground">
              {t("preferences.avatarHint")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">{t("preferences.languageLabel")}</Label>
              <Select
                onValueChange={(value) =>
                  patchDraft({ language: value as Locale })
                }
                value={draft.language}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder={t("common.language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hu">
                    {getLocaleLabel(locale, "hu")}
                  </SelectItem>
                  <SelectItem value="en">
                    {getLocaleLabel(locale, "en")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">{t("preferences.themeLabel")}</Label>
              <Select
                onValueChange={(value) =>
                  patchDraft({ theme: value as ThemeMode })
                }
                value={draft.theme}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder={t("common.theme")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    {getThemeLabel(locale, "light")}
                  </SelectItem>
                  <SelectItem value="dark">
                    {getThemeLabel(locale, "dark")}
                  </SelectItem>
                  <SelectItem value="system">
                    {getThemeLabel(locale, "system")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {state.message ? (
            <p
              className={
                state.status === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-primary"
              }
            >
              {state.message}
            </p>
          ) : null}

          <FormSubmitButton
            className="w-full sm:w-auto"
            pendingLabel={t("common.saving")}
          >
            {t("preferences.submit")}
          </FormSubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
