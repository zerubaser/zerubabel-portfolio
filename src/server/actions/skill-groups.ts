"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { skillGroupSchema } from "@/lib/validators/skill-group";
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
  errors: { slug: ["A skill group with this slug already exists."] },
};

export async function createSkillGroup(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = skillGroupSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.skillGroup.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        order: parsed.data.order,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return DUPLICATE;
    throw error;
  }
  revalidatePath("/admin/skill-groups");
  redirect("/admin/skill-groups");
}

export async function updateSkillGroup(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = skillGroupSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.skillGroup.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        order: parsed.data.order,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return DUPLICATE;
    throw error;
  }
  revalidatePath("/admin/skill-groups");
  redirect("/admin/skill-groups");
}

export async function deleteSkillGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  const dependents = await prisma.skill.count({ where: { groupId: id } });
  if (dependents > 0) {
    redirect("/admin/skill-groups?error=group-has-skills");
  }
  await prisma.skillGroup.delete({ where: { id } });
  revalidatePath("/admin/skill-groups");
  redirect("/admin/skill-groups");
}
