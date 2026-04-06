import {
  Globe,
  LayoutTemplate,
  LogOut,
  Monitor,
  MoonStar,
  SunMedium
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link, NavLink } from "react-router-dom";
import { startTransition, useOptimistic } from "react";
import { AppLogo } from "@/components/common/app-logo";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { updateProfilePreferences } from "@/features/preferences/preferences-service";
import { getLocaleLabel, getThemeLabel } from "@/lib/i18n/helpers";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/use-auth";
import { useI18n } from "@/providers/use-i18n";
import { useTheme } from "@/providers/use-theme";
import type { Locale, ThemeMode } from "@/types/domain";

const navigation = [
  { to: "/", key: "nav.home" },
  { to: "/components", key: "nav.components" },
  { to: "/app", key: "nav.dashboard" }
] as const;

function ThemeIcon({ theme }: { theme: ThemeMode }) {
  if (theme === "dark") {
    return <MoonStar className="h-4 w-4" />;
  }

  if (theme === "light") {
    return <SunMedium className="h-4 w-4" />;
  }

  return <Monitor className="h-4 w-4" />;
}

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const { bearerToken, isAuthenticated, session, signOut, updateSession } =
    useAuth();
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [optimisticLocale, setOptimisticLocale] = useOptimistic(
    locale,
    (_, next: Locale) => next
  );
  const [optimisticTheme, setOptimisticTheme] = useOptimistic(
    theme,
    (_, next: ThemeMode) => next
  );

  async function persistPreferences(nextLocale: Locale, nextTheme: ThemeMode) {
    if (!isAuthenticated || !session || !bearerToken) {
      return;
    }

    const result = await updateProfilePreferences(bearerToken, {
      displayName: session.displayName,
      avatarUrl: session.avatarUrl,
      language: nextLocale,
      theme: nextTheme
    });

    queryClient.setQueryData(["profile", bearerToken], result);
    startTransition(() => {
      updateSession({
        avatarUrl: result.profile.avatarUrl,
        displayName: result.profile.displayName,
        language: result.profile.language,
        theme: result.profile.theme
      });
    });
  }

  function handleLocaleChange(nextLocale: Locale) {
    const previousLocale = optimisticLocale;

    startTransition(() => {
      setOptimisticLocale(nextLocale);
      setLocale(nextLocale);
      if (isAuthenticated) {
        updateSession({ language: nextLocale });
      }
    });

    void persistPreferences(nextLocale, optimisticTheme).catch(() => {
      startTransition(() => {
        setOptimisticLocale(previousLocale);
        setLocale(previousLocale);
        if (isAuthenticated) {
          updateSession({ language: previousLocale });
        }
      });
      toast.error(t("preferences.error"));
    });
  }

  function handleThemeChange(nextTheme: ThemeMode) {
    const previousTheme = optimisticTheme;

    startTransition(() => {
      setOptimisticTheme(nextTheme);
      setTheme(nextTheme);
      if (isAuthenticated) {
        updateSession({ theme: nextTheme });
      }
    });

    void persistPreferences(optimisticLocale, nextTheme).catch(() => {
      startTransition(() => {
        setOptimisticTheme(previousTheme);
        setTheme(previousTheme);
        if (isAuthenticated) {
          updateSession({ theme: previousTheme });
        }
      });
      toast.error(t("preferences.error"));
    });
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="glass-surface flex items-center justify-between rounded-[2rem] border border-border/70 px-4 py-3 sm:px-5">
          <Link to="/" className="shrink-0">
            <AppLogo
              className={compact ? "scale-[0.92] origin-left" : undefined}
            />
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                    isActive && "bg-secondary text-secondary-foreground"
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {getLocaleLabel(locale, optimisticLocale)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("common.language")}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleLocaleChange("hu")}>
                  {getLocaleLabel(locale, "hu")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocaleChange("en")}>
                  {getLocaleLabel(locale, "en")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <ThemeIcon theme={optimisticTheme} />
                  <span className="hidden sm:inline">
                    {getThemeLabel(locale, optimisticTheme)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("common.theme")}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                  <SunMedium className="h-4 w-4" />
                  {getThemeLabel(locale, "light")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                  <MoonStar className="h-4 w-4" />
                  {getThemeLabel(locale, "dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                  <Monitor className="h-4 w-4" />
                  {getThemeLabel(locale, "system")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-11 rounded-full px-2"
                  >
                    <UserAvatar
                      avatarUrl={session.avatarUrl}
                      name={session.displayName}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.displayName}</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/app">
                      <LayoutTemplate className="h-4 w-4" />
                      {t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      void signOut();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="rounded-full">
                <a href="#auth-panel">{t("nav.signIn")}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
