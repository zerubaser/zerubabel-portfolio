import { z } from "zod";
import { slugSchema, statusEnum, optionalUrl } from "./common";

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: slugSchema,
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(1, "Content is required.").max(100000),
  coverImage: optionalUrl,
  status: statusEnum,
  publishedAt: z.coerce.date({ errorMap: () => ({ message: "Invalid date." }) }).optional(),
  metaTitle: z.string().trim().max(200).optional(),
  metaDescription: z.string().trim().max(400).optional(),
  ogImage: optionalUrl,
  canonicalUrl: optionalUrl,
  keywords: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

export type PostInput = z.infer<typeof postSchema>;
