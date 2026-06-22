"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { siteSettingsSchema } from "@/lib/validators/site-settings";
import {
  formString,
  formOptional,
  parseKeywords,
  type FormState,
} from "@/lib/form";

function readInput(formData: FormData) {
  return {
    siteName: formString(formData, "siteName"),
    siteUrl: formString(formData, "siteUrl"),
    title: formOptional(formData, "title"),
    heroTitle: formOptional(formData, "heroTitle"),
    heroSubtitle: formOptional(formData, "heroSubtitle"),
    bio: formOptional(formData, "bio"),
    email: formOptional(formData, "email"),
    phone: formOptional(formData, "phone"),
    location: formOptional(formData, "location"),
    profileImage: formOptional(formData, "profileImage"),
    resumeUrl: formOptional(formData, "resumeUrl"),
    socialLinks: formOptional(formData, "socialLinks"),
    defaultMetaTitle: formOptional(formData, "defaultMetaTitle"),
    defaultMetaDescription: formOptional(formData, "defaultMetaDescription"),
    defaultOgImage: formOptional(formData, "defaultOgImage"),
    keywords: parseKeywords(formData.get("keywords")),
  };
}

export async function updateSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  const d = parsed.data;
  const socialLinks: Prisma.InputJsonValue | typeof Prisma.DbNull = d.socialLinks
    ? (JSON.parse(d.socialLinks) as Prisma.InputJsonValue)
    : Prisma.DbNull;

  const data = {
    siteName: d.siteName,
    siteUrl: d.siteUrl,
    title: d.title ?? null,
    heroTitle: d.heroTitle ?? null,
    heroSubtitle: d.heroSubtitle ?? null,
    bio: d.bio ?? null,
    email: d.email ?? null,
    phone: d.phone ?? null,
    location: d.location ?? null,
    profileImage: d.profileImage ?? null,
    resumeUrl: d.resumeUrl ?? null,
    socialLinks,
    defaultMetaTitle: d.defaultMetaTitle ?? null,
    defaultMetaDescription: d.defaultMetaDescription ?? null,
    defaultOgImage: d.defaultOgImage ?? null,
    keywords: d.keywords,
  };

  const existing = await prisma.siteSettings.findFirst({ select: { id: true } });
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  revalidatePath("/admin/settings");
  return { ok: true, message: "Settings saved." };
}
