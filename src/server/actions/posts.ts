"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { postSchema, type PostInput } from "@/lib/validators/post";
import { slugify } from "@/lib/utils";
import {
  formString,
  formOptional,
  parseKeywords,
  type FormState,
} from "@/lib/form";

function readInput(formData: FormData) {
  const title = formString(formData, "title");
  const slugRaw = formString(formData, "slug").trim();
  return {
    title,
    slug: slugRaw ? slugify(slugRaw) : slugify(title),
    excerpt: formOptional(formData, "excerpt"),
    content: formString(formData, "content"),
    coverImage: formOptional(formData, "coverImage"),
    status: formString(formData, "status"),
    publishedAt: formOptional(formData, "publishedAt"),
    metaTitle: formOptional(formData, "metaTitle"),
    metaDescription: formOptional(formData, "metaDescription"),
    ogImage: formOptional(formData, "ogImage"),
    canonicalUrl: formOptional(formData, "canonicalUrl"),
    keywords: parseKeywords(formData.get("keywords")),
    tagIds: formData.getAll("tagIds").filter((v): v is string => typeof v === "string"),
  };
}

function scalarData(d: PostInput) {
  // Auto-stamp publish time when publishing without an explicit date.
  let publishedAt = d.publishedAt ?? null;
  if (!publishedAt && d.status === "PUBLISHED") publishedAt = new Date();
  return {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt ?? null,
    content: d.content,
    coverImage: d.coverImage ?? null,
    status: d.status,
    publishedAt,
    metaTitle: d.metaTitle ?? null,
    metaDescription: d.metaDescription ?? null,
    ogImage: d.ogImage ?? null,
    canonicalUrl: d.canonicalUrl ?? null,
    keywords: d.keywords,
  };
}

function tagCreate(tagIds: string[]) {
  return tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } }));
}

function mapWriteError(error: unknown): FormState | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return { ok: false, errors: { slug: ["A post with this slug already exists."] } };
    }
    if (error.code === "P2003" || error.code === "P2025") {
      return { ok: false, errors: { tagIds: ["A selected tag no longer exists."] } };
    }
  }
  return null;
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = postSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.post.create({
      data: { ...scalarData(parsed.data), tags: { create: tagCreate(parsed.data.tagIds) } },
    });
  } catch (error) {
    const mapped = mapWriteError(error);
    if (mapped) return mapped;
    throw error;
  }
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = postSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.post.update({
      where: { id },
      data: {
        ...scalarData(parsed.data),
        tags: { deleteMany: {}, create: tagCreate(parsed.data.tagIds) },
      },
    });
  } catch (error) {
    const mapped = mapWriteError(error);
    if (mapped) return mapped;
    throw error;
  }
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function togglePostPublished(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { status: true, publishedAt: true },
  });
  if (!post) return;
  const publishing = post.status !== "PUBLISHED";
  await prisma.post.update({
    where: { id },
    data: {
      status: publishing ? "PUBLISHED" : "DRAFT",
      publishedAt: publishing ? (post.publishedAt ?? new Date()) : post.publishedAt,
    },
  });
  revalidatePath("/admin/blog");
}
