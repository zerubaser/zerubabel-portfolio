import { z } from "zod";
import { statusEnum, optionalUrl } from "./common";

export const testimonialSchema = z.object({
  author: z.string().trim().min(1, "Author is required.").max(150),
  role: z.string().trim().max(150).optional(),
  company: z.string().trim().max(150).optional(),
  avatar: optionalUrl,
  quote: z.string().trim().min(1, "Quote is required.").max(2000),
  featured: z.boolean().default(false),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),
  status: statusEnum,
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
