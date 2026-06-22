"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { tagSchema } from "@/lib/validators/tag";
import { slugify } from "@/lib/utils";
import { formString, type FormState } from "@/lib/form";

function readInput(formData: FormData) {
  const name = formString(formData, "name");
  const slugRaw = formString(formData, "slug").trim();
  return { name, slug: slugRaw ? slugify(slugRaw) : slugify(name) };
}

const DUPLICATE = {
  ok: false as const,
  errors: { slug: ["A tag with this name or slug already exists."] },
};

export async function createTag(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = tagSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.tag.create({ data: parsed.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return DUPLICATE;
    throw error;
  }
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function updateTag(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = tagSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.tag.update({ where: { id }, data: parsed.data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return DUPLICATE;
    throw error;
  }
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function deleteTag(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  // PostTag join rows cascade-delete with the Tag.
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}
