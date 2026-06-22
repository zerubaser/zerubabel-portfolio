import { z } from "zod";
import { slugSchema, statusEnum } from "./common";

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(150),
  slug: slugSchema,
  description: z.string().trim().min(1, "Description is required.").max(5000),
  icon: z.string().trim().max(200).optional(),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),
  status: statusEnum,
});

export type ServiceInput = z.infer<typeof serviceSchema>;
