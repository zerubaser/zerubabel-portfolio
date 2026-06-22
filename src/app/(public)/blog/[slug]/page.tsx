import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { TechBadge } from "@/components/public/tech-badge";
import { ContentRenderer } from "@/components/public/content-renderer";
import { MediaImage } from "@/components/public/media-image";
import { JsonLd } from "@/components/public/json-ld";
import { buildMetadata, resolveSiteUrl } from "@/lib/seo";
import { breadcrumbJsonLd, blogPostingJsonLd } from "@/lib/structured-data";
import { getSiteSettings, getPublishedPostBySlug } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, post] = await Promise.all([
    getSiteSettings(),
    getPublishedPostBySlug(slug),
  ]);
  if (!post) return { title: "Not found", robots: { index: false } };
  return buildMetadata({
    settings,
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: post.ogImage || post.coverImage,
    canonical: post.canonicalUrl,
    keywords: post.keywords,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([
    getSiteSettings(),
    getPublishedPostBySlug(slug),
  ]);
  if (!post) notFound();

  const base = resolveSiteUrl(settings).replace(/\/$/, "");
  const published = post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : null;

  return (
    <article className="mx-auto max-w-3xl py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(
            [
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ],
            base,
          ),
          blogPostingJsonLd(post, settings, base),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header>
        {published ? <time dateTime={published} className="text-xs text-muted-foreground">{published}</time> : null}
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        {post.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => <TechBadge key={t.tag.slug}>{t.tag.name}</TechBadge>)}
          </div>
        ) : null}
      </header>

      {post.coverImage ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <MediaImage src={post.coverImage} alt={post.title} className="max-h-[480px] w-full object-cover" />
        </div>
      ) : null}

      <ContentRenderer content={post.content} className="mt-8 text-base" />
    </article>
  );
}
