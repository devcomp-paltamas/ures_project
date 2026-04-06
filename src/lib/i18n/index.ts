import { en } from "@/lib/i18n/en";
import { hu } from "@/lib/i18n/hu";
import type { Locale } from "@/types/domain";

const dictionaries = { en, hu } as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function translate(locale: Locale, path: string) {
  const dictionary = getDictionary(locale) as Record<string, unknown>;
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current === "object" && current && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return path;
  }, dictionary) as string;
}
