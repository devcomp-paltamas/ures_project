import { useEffect, useState, type ReactNode } from "react";
import {
  readLanguagePreference,
  writeLanguagePreference
} from "@/lib/browser-storage";
import { getDictionary, translate } from "@/lib/i18n";
import { I18nContext, type I18nContextValue } from "@/providers/i18n-context";
import { useAuth } from "@/providers/use-auth";
import type { Locale } from "@/types/domain";

export function I18nProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [preferredLocale, setPreferredLocale] = useState<Locale | null>(() => {
    const stored = readLanguagePreference();
    return stored === "hu" || stored === "en" ? stored : null;
  });
  const locale = preferredLocale ?? session?.language ?? "hu";

  useEffect(() => {
    document.documentElement.lang = locale;
    writeLanguagePreference(locale);
    getDictionary(locale);
  }, [locale]);

  const value: I18nContextValue = {
    locale,
    setLocale: setPreferredLocale,
    t: (path) => translate(locale, path)
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
