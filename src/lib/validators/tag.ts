import { z } from "zod";
import { slugSchema } from "./common";

export const tagSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  slug: slugSchema,
});

export type TagInput = z.infer<typeof tagSchema>;
