import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugMessage =
  "Slug must be lowercase letters, numbers, and single hyphens.";

export const techSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  slug: z.string().trim().min(1, "Slug is required.").max(100).regex(SLUG_RE, slugMessage),
  icon: z.string().trim().max(200).optional(),
  color: z.string().trim().max(40).optional(),
});

export type TechInput = z.infer<typeof techSchema>;
