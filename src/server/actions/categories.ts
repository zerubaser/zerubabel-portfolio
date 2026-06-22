"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { categorySchema } from "@/lib/validators/category";
import { slugify } from "@/lib/utils";
import { formString, formOptional, type FormState } from "@/lib/form";

function readInput(formData: FormData) {
  const name = formString(formData, "name");
  const slugRaw = formString(formData, "slug").trim();
  return {
    name,
    slug: slugRaw ? slugify(slugRaw) : slugify(name),
    description: formOptional(formData, "description"),
    order: formOptional(formData, "order"),
  };
}

const DUPLICATE = {
  ok: false as const,
  errors: { slug: ["A category with this name or slug already exists."] },
};

export async function createCategory(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        order: parsed.data.order,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return DUPLICATE;
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        order: parsed.data.order,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return DUPLICATE;
    }
    throw error;
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;

  // Safety: do not delete a category that still has projects (FK would fail).
  const dependents = await prisma.project.count({ where: { categoryId: id } });
  if (dependents > 0) {
    redirect("/admin/categories?error=category-has-projects");
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
