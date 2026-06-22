import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugMessage =
  "Slug must be lowercase letters, numbers, and single hyphens.";

const optionalUrl = z.string().trim().url("Must be a valid URL.").optional();

const optionalJson = z
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
    { message: "Impact metrics must be valid JSON." },
  );

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z.string().trim().min(1, "Slug is required.").max(220).regex(SLUG_RE, slugMessage),
  summary: z.string().trim().min(1, "Summary is required.").max(500),
  description: z.string().trim().max(20000).optional(),

  clientName: z.string().trim().max(200).optional(),
  projectType: z.string().trim().max(200).optional(),
  industry: z.string().trim().max(200).optional(),
  myRole: z.string().trim().max(200).optional(),

  startDate: z.coerce.date({ errorMap: () => ({ message: "Invalid start date." }) }).optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Invalid end date." }) }).optional(),

  problem: z.string().trim().max(20000).optional(),
  solution: z.string().trim().max(20000).optional(),
  features: z.string().trim().max(20000).optional(),
  outcome: z.string().trim().max(20000).optional(),

  impactMetrics: optionalJson,

  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  ogImage: optionalUrl,
  canonicalUrl: optionalUrl,

  isConfidential: z.boolean().default(false),
  visibility: z.enum(["PUBLIC", "LIMITED", "CONFIDENTIAL"], {
    errorMap: () => ({ message: "Select a valid visibility." }),
  }),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    errorMap: () => ({ message: "Select a valid status." }),
  }),
  order: z.coerce.number().int("Order must be a whole number.").min(0).default(0),

  metaTitle: z.string().trim().max(200).optional(),
  metaDescription: z.string().trim().max(400).optional(),

  categoryId: z.string().min(1, "Category is required."),
  keywords: z.array(z.string()).default([]),
  techIds: z.array(z.string()).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
