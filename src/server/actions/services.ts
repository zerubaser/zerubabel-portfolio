"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { serviceSchema } from "@/lib/validators/service";
import { slugify } from "@/lib/utils";
import { formString, formOptional, type FormState } from "@/lib/form";

function readInput(formData: FormData) {
  const title = formString(formData, "title");
  const slugRaw = formString(formData, "slug").trim();
  return {
    title,
    slug: slugRaw ? slugify(slugRaw) : slugify(title),
    description: formString(formData, "description"),
    icon: formOptional(formData, "icon"),
    order: formOptional(formData, "order"),
    status: formString(formData, "status"),
  };
}

const DUPLICATE = {
  ok: false as const,
  errors: { slug: ["A service with this slug already exists."] },
};

function toData(d: ReturnType<typeof serviceSchema.parse>) {
  return {
    title: d.title,
    slug: d.slug,
    description: d.description,
    icon: d.icon ?? null,
    order: d.order,
    status: d.status,
  };
}

export async function createService(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.service.create({ data: toData(parsed.data) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return DUPLICATE;
    throw error;
  }
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.service.update({ where: { id }, data: toData(parsed.data) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return DUPLICATE;
    throw error;
  }
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
