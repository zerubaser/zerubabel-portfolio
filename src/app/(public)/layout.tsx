import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { getSiteSettings } from "@/server/repositories/public-site";
import { FALLBACK_NAME } from "@/lib/seo";

// DB-driven; build runs off-server (no database), so never prerender at build.
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || FALLBACK_NAME;
  const social = (settings?.socialLinks as Record<string, string> | null) ?? null;

  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:ring-2 focus:ring-sky-400"
      >
        Skip to content
      </a>
      <SiteHeader siteName={siteName} />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4">
        {children}
      </main>
      <SiteFooter siteName={siteName} tagline={settings?.title ?? settings?.heroSubtitle} social={social} />
    </div>
  );
}
