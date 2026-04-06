import { z } from "zod";
import { itemVisibilities, locales, themeModes } from "@/types/domain";

const localizedTextSchema = z.object({
  hu: z.string().trim().min(1).max(4000),
  en: z.string().trim().min(1).max(4000)
});

export const authSessionRequestSchema = z.object({
  idToken: z.string().min(1)
});

export const appPreferenceInputSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  avatarUrl: z
    .string()
    .trim()
    .url()
    .nullable()
    .or(z.literal("").transform(() => null)),
  language: z.enum(locales),
  theme: z.enum(themeModes)
});

export const itemInputSchema = z.object({
  titleI18n: localizedTextSchema.extend({
    hu: z.string().trim().min(1).max(160),
    en: z.string().trim().min(1).max(160)
  }),
  summaryI18n: localizedTextSchema,
  visibility: z.enum(itemVisibilities),
  isPinned: z.boolean()
});
