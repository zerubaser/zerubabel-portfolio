"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import {
  projectImageCreateSchema,
  projectImageUpdateSchema,
} from "@/lib/validators/project-image";
import { deleteUploadByUrl } from "@/lib/upload";
import { formString, formOptional, type FormState } from "@/lib/form";

type CreateInput = {
  projectId: string;
  url: string;
  type: string;
  altText?: string;
  caption?: string;
  order?: number;
};

/** Called from the uploader after a successful file upload returns a URL. */
export async function createProjectImage(input: CreateInput): Promise<FormState> {
  await requireAdmin();

  if (!input.projectId) return { ok: false, message: "Missing project." };

  const parsed = projectImageCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const project = await prisma.project.findUnique({
    where: { id: input.projectId },
    select: { id: true },
  });
  if (!project) return { ok: false, message: "Project not found." };

  await prisma.projectImage.create({
    data: {
      projectId: input.projectId,
      url: parsed.data.url,
      altText: parsed.data.altText ?? null,
      caption: parsed.data.caption ?? null,
      type: parsed.data.type,
      order: parsed.data.order,
    },
  });

  revalidatePath(`/admin/projects/${input.projectId}/images`);
  return { ok: true };
}

export async function updateProjectImage(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const parsed = projectImageUpdateSchema.safeParse({
    type: formString(formData, "type"),
    altText: formOptional(formData, "altText"),
    caption: formOptional(formData, "caption"),
    order: formOptional(formData, "order"),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.projectImage.findUnique({
    where: { id },
    select: { projectId: true },
  });
  if (!existing) return { ok: false, message: "Image not found." };

  await prisma.projectImage.update({
    where: { id },
    data: {
      type: parsed.data.type,
      altText: parsed.data.altText ?? null,
      caption: parsed.data.caption ?? null,
      order: parsed.data.order,
    },
  });

  revalidatePath(`/admin/projects/${existing.projectId}/images`);
  return { ok: true };
}

export async function deleteProjectImage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;

  const image = await prisma.projectImage.findUnique({
    where: { id },
    select: { url: true, projectId: true },
  });
  if (!image) return;

  await prisma.projectImage.delete({ where: { id } });
  // Remove the physical file too (only touches files under UPLOAD_DIR).
  await deleteUploadByUrl(image.url);

  revalidatePath(`/admin/projects/${image.projectId}/images`);
}
