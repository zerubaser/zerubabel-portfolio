"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { techSchema } from "@/lib/validators/tech";
import { slugify } from "@/lib/utils";
import { formString, formOptional, type FormState } from "@/lib/form";

function readInput(formData: FormData) {
  const name = formString(formData, "name");
  const slugRaw = formString(formData, "slug").trim();
  return {
    name,
    slug: slugRaw ? slugify(slugRaw) : slugify(name),
    icon: formOptional(formData, "icon"),
    color: formOptional(formData, "color"),
  };
}

const DUPLICATE = {
  ok: false as const,
  errors: { slug: ["A tech with this name or slug already exists."] },
};

export async function createTech(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = techSchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.tech.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        icon: parsed.data.icon ?? null,
        color: parsed.data.color ?? null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return DUPLICATE;
    }
    throw error;
  }

  revalidatePath("/admin/tech");
  redirect("/admin/tech");
}

export async function updateTech(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = techSchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.tech.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        icon: parsed.data.icon ?? null,
        color: parsed.data.color ?? null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return DUPLICATE;
    }
    throw error;
  }

  revalidatePath("/admin/tech");
  redirect("/admin/tech");
}

export async function deleteTech(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;

  // ProjectTech join rows cascade-delete with the Tech, so this is safe.
  await prisma.tech.delete({ where: { id } });
  revalidatePath("/admin/tech");
  redirect("/admin/tech");
}
