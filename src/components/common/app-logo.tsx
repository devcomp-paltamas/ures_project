import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

export function AppLogo({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[#101828] text-[#f5d36a] shadow-lg">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(43,182,115,0.35),transparent_42%)]" />
        <span className="relative text-lg font-black tracking-tight">u</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          uresalap
        </span>
        <span className="text-base font-semibold text-foreground">{t("common.appSubtitle")}</span>
      </div>
    </div>
  );
}
