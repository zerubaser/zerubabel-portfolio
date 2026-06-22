import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = resolveSiteUrl(settings).replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
