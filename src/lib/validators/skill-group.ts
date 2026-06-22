import { z } from "zod";
import { slugSchema } from "./common";

export const skillGroupSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  slug: slugSchema,
  description: z.string().trim().max(2000).optional(),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),
});

export type SkillGroupInput = z.infer<typeof skillGroupSchema>;
