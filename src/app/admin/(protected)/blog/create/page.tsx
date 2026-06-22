import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../post-form";
import { createPost } from "@/server/actions/posts";

export const metadata: Metadata = { title: "New Post", robots: { index: false, follow: false } };

export default async function CreatePostPage() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New post</h1>
      <PostForm action={createPost} tags={tags} />
    </div>
  );
}
