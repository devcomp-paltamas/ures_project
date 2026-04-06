import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import { readLanguagePreference, writeLanguagePreference } from "@/lib/browser-storage";
import { getDictionary, translate } from "@/lib/i18n";
import type { Locale } from "@/types/domain";
import { useAuth } from "@/providers/auth-provider";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

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

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
