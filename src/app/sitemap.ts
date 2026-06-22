import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/seo";
import {
  getSiteSettings,
  getPublicProjectSlugs,
  getPublishedPostSlugs,
} from "@/server/repositories/public-site";

// Dynamic so the build never needs a database (build runs off-server).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = resolveSiteUrl(settings).replace(/\/$/, "");
  const [projects, posts] = await Promise.all([
    getPublicProjectSlugs(),
    getPublishedPostSlugs(),
  ]);

  const now = new Date();
  const staticPaths = ["", "/projects", "/services", "/blog", "/about", "/contact"];

  return [
    ...staticPaths.map((p) => ({ url: `${base}${p || "/"}`, lastModified: now })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
