import type { Metadata } from "next";
import Link from "next/link";
import { MediaImage } from "@/components/public/media-image";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings, getPublishedPosts } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    settings,
    title: "Blog",
    description: "Devlog, case studies, and notes on building software.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">Notes, devlogs, and case studies.</p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-muted-foreground">
          No posts yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-white/25">
              {post.coverImage ? (
                <div className="aspect-video w-full overflow-hidden bg-white/5">
                  <MediaImage src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs text-muted-foreground">
                  {post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : ""}
                </p>
                <h2 className="font-semibold">{post.title}</h2>
                {post.excerpt ? <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p> : null}
                {post.tags.length > 0 ? (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {post.tags.map((t) => (
                      <span key={t.tag.slug} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted-foreground">{t.tag.name}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
