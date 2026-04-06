import { z } from "zod";
import { itemVisibilities, locales, themeModes } from "@/types/domain";

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
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(4000),
  visibility: z.enum(itemVisibilities),
  isPinned: z.boolean()
});
