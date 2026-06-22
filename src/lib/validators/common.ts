import { z } from "zod";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(220)
  .regex(SLUG_RE, "Slug must be lowercase letters, numbers, and single hyphens.");

export const statusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
  errorMap: () => ({ message: "Select a valid status." }),
});

export const optionalUrl = z.string().trim().url("Must be a valid URL.").optional();

export const optionalJson = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be valid JSON." },
  );
