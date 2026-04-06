import { createContext } from "react";
import type { Locale } from "@/types/domain";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
