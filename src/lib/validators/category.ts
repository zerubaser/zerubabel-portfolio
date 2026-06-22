import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugMessage =
  "Slug must be lowercase letters, numbers, and single hyphens.";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  slug: z.string().trim().min(1, "Slug is required.").max(120).regex(SLUG_RE, slugMessage),
  description: z.string().trim().max(2000).optional(),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
