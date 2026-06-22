import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../../post-form";
import { updatePost } from "@/server/actions/posts";

export const metadata: Metadata = { title: "Edit Post", robots: { index: false, follow: false } };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, tags] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { tags: { select: { tagId: true } } } }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!post) notFound();

  const values = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    coverImage: post.coverImage ?? undefined,
    status: post.status,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : undefined,
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    ogImage: post.ogImage ?? undefined,
    canonicalUrl: post.canonicalUrl ?? undefined,
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <PostForm action={updatePost.bind(null, post.id)} tags={tags} values={values} selectedTagIds={post.tags.map((t) => t.tagId)} />
    </div>
  );
}
