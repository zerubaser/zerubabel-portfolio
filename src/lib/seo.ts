import type { Metadata } from "next";

type SettingsLike = {
  siteName?: string | null;
  siteUrl?: string | null;
  defaultMetaTitle?: string | null;
  defaultMetaDescription?: string | null;
  defaultOgImage?: string | null;
  keywords?: string[] | null;
} | null;

export const FALLBACK_NAME = "Zerubabel Shimeles";
export const FALLBACK_URL = "https://zerubabel.et";
export const FALLBACK_DESCRIPTION =
  "Full-stack developer building mobile apps, backend APIs, ERP systems, clinic/lab systems, LMS platforms, WordPress systems, and business tools.";

export function resolveSiteUrl(settings: SettingsLike): string {
  return settings?.siteUrl || process.env.NEXTAUTH_URL || FALLBACK_URL;
}

/** Turn a relative `/uploads/...` (or any path) into an absolute URL. */
export function absoluteUrl(path: string | null | undefined, base: string): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  try {
    return new URL(path, base).toString();
  } catch {
    return undefined;
  }
}

export function buildMetadata(opts: {
  settings: SettingsLike;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  canonical?: string | null;
  keywords?: string[] | null;
  path?: string;
}): Metadata {
  const base = resolveSiteUrl(opts.settings);
  const name = opts.settings?.siteName || FALLBACK_NAME;
  const title = opts.title || opts.settings?.defaultMetaTitle || name;
  const description =
    opts.description || opts.settings?.defaultMetaDescription || FALLBACK_DESCRIPTION;
  const ogImage = absoluteUrl(opts.image || opts.settings?.defaultOgImage, base);
  const canonical =
    opts.canonical || (opts.path ? absoluteUrl(opts.path, base) : undefined);
  const keywords =
    opts.keywords && opts.keywords.length ? opts.keywords : (opts.settings?.keywords ?? undefined);

  return {
    title,
    description,
    keywords: keywords ?? undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url: canonical ?? base,
      siteName: name,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
