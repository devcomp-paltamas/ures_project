import type { VercelRequest } from "@vercel/node";
import { locales, type Locale } from "@/types/domain";

export function getRequestLocale(request: VercelRequest): Locale {
  const raw = Array.isArray(request.query.locale)
    ? request.query.locale[0]
    : request.query.locale;

  return locales.includes(raw as Locale) ? (raw as Locale) : "hu";
}
