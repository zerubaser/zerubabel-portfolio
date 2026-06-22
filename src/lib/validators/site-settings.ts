import { z } from "zod";
import { optionalUrl, optionalJson } from "./common";

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required.").max(150),
  siteUrl: z.string().trim().url("Must be a valid URL."),
  title: z.string().trim().max(200).optional(),
  heroTitle: z.string().trim().max(200).optional(),
  heroSubtitle: z.string().trim().max(500).optional(),
  bio: z.string().trim().max(5000).optional(),
  email: z.string().trim().email("Invalid email.").optional(),
  phone: z.string().trim().max(50).optional(),
  location: z.string().trim().max(150).optional(),
  profileImage: optionalUrl,
  resumeUrl: optionalUrl,
  socialLinks: optionalJson,
  defaultMetaTitle: z.string().trim().max(200).optional(),
  defaultMetaDescription: z.string().trim().max(400).optional(),
  defaultOgImage: optionalUrl,
  keywords: z.array(z.string()).default([]),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
