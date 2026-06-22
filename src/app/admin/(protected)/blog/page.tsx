import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/badges";
import { deletePost, togglePostPublished } from "@/server/actions/posts";

export const metadata: Metadata = { title: "Blog", robots: { index: false, follow: false } };

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: { _count: { select: { tags: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href="/admin/blog/create" className={buttonVariants()}>New post</Link>
      </div>
      {posts.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Published</th>
                <th className="px-4 py-2 font-medium">Tags</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border align-top last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted-foreground">{post.slug}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : "—"}
                  </td>
                  <td className="px-4 py-3">{post._count.tags}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <form action={togglePostPublished}>
                        <input type="hidden" name="id" value={post.id} />
                        <Button type="submit" variant="outline" size="sm">
                          {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                      <Link href={`/admin/blog/${post.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                      <DeleteButton action={deletePost} id={post.id} confirmMessage="Delete this post? This cannot be undone." />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
