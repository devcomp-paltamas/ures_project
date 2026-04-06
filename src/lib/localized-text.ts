import type { Locale, LocalizedText } from "@/types/domain";

export function createLocalizedText(value: string): LocalizedText {
  return {
    hu: value,
    en: value
  };
}

export function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    typeof value === "object" &&
    value !== null &&
    "hu" in value &&
    "en" in value &&
    typeof value.hu === "string" &&
    typeof value.en === "string"
  );
}

export function resolveLocalizedText(
  locale: Locale,
  value: LocalizedText | null | undefined,
  fallback: string
) {
  if (!value) {
    return fallback;
  }

  const current = value[locale].trim();
  if (current) {
    return current;
  }

  const secondary = (locale === "hu" ? value.en : value.hu).trim();
  return secondary || fallback;
}
