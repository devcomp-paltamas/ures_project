import { useEffect, useState, type ReactNode } from "react";
import {
  readThemePreference,
  writeThemePreference
} from "@/lib/browser-storage";
import {
  ThemeContext,
  type ResolvedTheme,
  type ThemeContextValue
} from "@/providers/theme-context";
import { useAuth } from "@/providers/use-auth";
import type { ThemeMode } from "@/types/domain";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [preferredTheme, setThemeState] = useState<ThemeMode | null>(() => {
    const stored = readThemePreference();
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }

    return null;
  });
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const theme = preferredTheme ?? session?.theme ?? "system";
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.dataset.theme = theme;
    writeThemePreference(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [resolvedTheme, theme]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme: setThemeState
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
