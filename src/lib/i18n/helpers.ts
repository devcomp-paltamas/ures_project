import { translate } from "@/lib/i18n";
import type { AuthProvider, Locale, ThemeMode } from "@/types/domain";

export function getLocaleLabel(currentLocale: Locale, value: Locale) {
  return translate(currentLocale, value === "hu" ? "common.localeHu" : "common.localeEn");
}

export function getThemeLabel(currentLocale: Locale, value: ThemeMode) {
  if (value === "light") {
    return translate(currentLocale, "common.themeLight");
  }

  if (value === "dark") {
    return translate(currentLocale, "common.themeDark");
  }

  return translate(currentLocale, "common.themeSystem");
}

export function getAuthProviderLabel(currentLocale: Locale, value: AuthProvider | "mock") {
  if (value === "google") {
    return translate(currentLocale, "common.authProviderGoogle");
  }

  if (value === "password") {
    return translate(currentLocale, "common.authProviderPassword");
  }

  return translate(currentLocale, "common.authProviderMock");
}
