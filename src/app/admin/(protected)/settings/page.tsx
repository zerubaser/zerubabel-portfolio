import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Site Settings", robots: { index: false, follow: false } };

export default async function SettingsPage() {
  // Single settings record — create it on first visit if missing.
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }

  const values = {
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    title: settings.title,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    bio: settings.bio,
    email: settings.email,
    phone: settings.phone,
    location: settings.location,
    profileImage: settings.profileImage,
    resumeUrl: settings.resumeUrl,
    socialLinks: settings.socialLinks ? JSON.stringify(settings.socialLinks, null, 2) : "",
    defaultMetaTitle: settings.defaultMetaTitle,
    defaultMetaDescription: settings.defaultMetaDescription,
    defaultOgImage: settings.defaultOgImage,
    keywords: settings.keywords.join(", "),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Site settings</h1>
      <SettingsForm values={values} />
    </div>
  );
}
