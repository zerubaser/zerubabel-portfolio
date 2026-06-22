"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { experienceSchema } from "@/lib/validators/experience";
import { formString, formOptional, type FormState } from "@/lib/form";

function readInput(formData: FormData) {
  return {
    role: formString(formData, "role"),
    org: formString(formData, "org"),
    location: formOptional(formData, "location"),
    startDate: formOptional(formData, "startDate"),
    endDate: formOptional(formData, "endDate"),
    description: formOptional(formData, "description"),
    order: formOptional(formData, "order"),
    status: formString(formData, "status"),
  };
}

function toData(d: ReturnType<typeof experienceSchema.parse>) {
  return {
    role: d.role,
    org: d.org,
    location: d.location ?? null,
    startDate: d.startDate ?? null,
    endDate: d.endDate ?? null,
    description: d.description ?? null,
    order: d.order,
    status: d.status,
  };
}

export async function createExperience(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.experience.create({ data: toData(parsed.data) });
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function updateExperience(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.experience.update({ where: { id }, data: toData(parsed.data) });
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function deleteExperience(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}
