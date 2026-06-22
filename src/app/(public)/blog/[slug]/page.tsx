import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/public/media-image";
import { buildMetadata } from "@/lib/seo";
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
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl py-10">
      <Link href="/blog" className="text-sm text-sky-400 hover:underline">← All posts</Link>

      <header className="mt-4">
        <p className="text-xs text-muted-foreground">
          {post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : ""}
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{post.title}</h1>
        {post.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t.tag.slug} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted-foreground">{t.tag.name}</span>
            ))}
          </div>
        ) : null}
      </header>

      {post.coverImage ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <MediaImage src={post.coverImage} alt={post.title} className="max-h-[480px] w-full object-cover" />
        </div>
      ) : null}

      {/* Content is stored as plain text / lightweight markdown. Rendered as
          escaped text (whitespace preserved) — no raw HTML injection. */}
      <div className="mt-8 whitespace-pre-wrap leading-relaxed text-muted-foreground">
        {post.content}
      </div>
    </article>
  );
}
