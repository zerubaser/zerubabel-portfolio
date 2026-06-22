import { z } from "zod";
import { statusEnum } from "./common";

export const experienceSchema = z.object({
  role: z.string().trim().min(1, "Role is required.").max(150),
  org: z.string().trim().min(1, "Organization is required.").max(150),
  location: z.string().trim().max(150).optional(),
  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid start date." }) }).optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Invalid end date." }) }).optional(),
  description: z.string().trim().max(5000).optional(),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),
  status: statusEnum,
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
