import { Skeleton } from "@/components/ui/skeleton";
import { AppLogo } from "@/components/common/app-logo";
import { useI18n } from "@/providers/i18n-provider";

export function LoadingScreen() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-surface w-full max-w-3xl rounded-[2rem] border border-border/70 p-8">
        <AppLogo />
        <div className="mt-10 space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("common.loadingShell")}
          </p>
          <Skeleton className="h-14 w-full rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40 rounded-[2rem]" />
            <Skeleton className="h-40 rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
