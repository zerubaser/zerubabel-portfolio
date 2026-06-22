import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  level: z.coerce
    .number()
    .int("Level must be a whole number.")
    .min(0, "Level must be between 0 and 100.")
    .max(100, "Level must be between 0 and 100.")
    .optional(),
  icon: z.string().trim().max(200).optional(),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),
  groupId: z.string().min(1, "Group is required."),
  techId: z.string().optional(),
});

export type SkillInput = z.infer<typeof skillSchema>;
