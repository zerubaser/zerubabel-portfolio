import { absoluteUrl, FALLBACK_NAME } from "@/lib/seo";

type Settings = {
  siteName?: string | null;
  title?: string | null;
  profileImage?: string | null;
  email?: string | null;
  location?: string | null;
  socialLinks?: unknown;
} | null;

type JsonLdObject = Record<string, unknown>;

export function personJsonLd(settings: Settings, base: string): JsonLdObject {
  const social =
    settings?.socialLinks && typeof settings.socialLinks === "object" && !Array.isArray(settings.socialLinks)
      ? Object.values(settings.socialLinks as Record<string, unknown>).filter(
          (v): v is string => typeof v === "string" && v.length > 0,
        )
      : [];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings?.siteName || FALLBACK_NAME,
    url: base,
    jobTitle: settings?.title || "Full-Stack Developer",
    ...(settings?.profileImage ? { image: absoluteUrl(settings.profileImage, base) } : {}),
    ...(settings?.email ? { email: settings.email } : {}),
    ...(settings?.location
      ? { address: { "@type": "PostalAddress", addressLocality: settings.location } }
      : {}),
    ...(social.length ? { sameAs: social } : {}),
  };
}

export function websiteJsonLd(settings: Settings, base: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteName || FALLBACK_NAME,
    url: base,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  base: string,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

export function creativeWorkJsonLd(
  project: {
    title: string;
    slug: string;
    summary: string;
    keywords: string[];
    ogImage?: string | null;
    category?: { name: string } | null;
    images?: { url: string }[];
  },
  base: string,
): JsonLdObject {
  const image = project.ogImage || project.images?.[0]?.url;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${base}/projects/${project.slug}`,
    ...(project.category ? { about: project.category.name } : {}),
    ...(project.keywords.length ? { keywords: project.keywords.join(", ") } : {}),
    ...(image ? { image: absoluteUrl(image, base) } : {}),
  };
}

export function blogPostingJsonLd(
  post: {
    title: string;
    slug: string;
    excerpt?: string | null;
    publishedAt: Date | null;
    coverImage?: string | null;
    ogImage?: string | null;
  },
  settings: Settings,
  base: string,
): JsonLdObject {
  const image = post.ogImage || post.coverImage;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: `${base}/blog/${post.slug}`,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt.toISOString() } : {}),
    author: { "@type": "Person", name: settings?.siteName || FALLBACK_NAME },
    ...(image ? { image: absoluteUrl(image, base) } : {}),
  };
}
