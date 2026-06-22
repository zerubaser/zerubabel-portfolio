"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { skillSchema } from "@/lib/validators/skill";
import { formString, formOptional, type FormState } from "@/lib/form";

function readInput(formData: FormData) {
  return {
    name: formString(formData, "name"),
    level: formOptional(formData, "level"),
    icon: formOptional(formData, "icon"),
    order: formOptional(formData, "order"),
    groupId: formString(formData, "groupId"),
    techId: formOptional(formData, "techId"),
  };
}

function mapError(error: unknown): FormState | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003" || error.code === "P2025") {
      return { ok: false, errors: { groupId: ["Selected group or tech no longer exists."] } };
    }
  }
  return null;
}

export async function createSkill(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.skill.create({
      data: {
        name: parsed.data.name,
        level: parsed.data.level ?? null,
        icon: parsed.data.icon ?? null,
        order: parsed.data.order,
        group: { connect: { id: parsed.data.groupId } },
        ...(parsed.data.techId ? { tech: { connect: { id: parsed.data.techId } } } : {}),
      },
    });
  } catch (error) {
    const mapped = mapError(error);
    if (mapped) return mapped;
    throw error;
  }
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function updateSkill(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.skill.update({
      where: { id },
      data: {
        name: parsed.data.name,
        level: parsed.data.level ?? null,
        icon: parsed.data.icon ?? null,
        order: parsed.data.order,
        group: { connect: { id: parsed.data.groupId } },
        tech: parsed.data.techId
          ? { connect: { id: parsed.data.techId } }
          : { disconnect: true },
      },
    });
  } catch (error) {
    const mapped = mapError(error);
    if (mapped) return mapped;
    throw error;
  }
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkill(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}
