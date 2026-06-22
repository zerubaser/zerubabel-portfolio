"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { projectSchema, type ProjectInput } from "@/lib/validators/project";
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
    summary: formString(formData, "summary"),
    description: formOptional(formData, "description"),
    clientName: formOptional(formData, "clientName"),
    projectType: formOptional(formData, "projectType"),
    industry: formOptional(formData, "industry"),
    myRole: formOptional(formData, "myRole"),
    startDate: formOptional(formData, "startDate"),
    endDate: formOptional(formData, "endDate"),
    problem: formOptional(formData, "problem"),
    solution: formOptional(formData, "solution"),
    features: formOptional(formData, "features"),
    outcome: formOptional(formData, "outcome"),
    impactMetrics: formOptional(formData, "impactMetrics"),
    liveUrl: formOptional(formData, "liveUrl"),
    githubUrl: formOptional(formData, "githubUrl"),
    ogImage: formOptional(formData, "ogImage"),
    canonicalUrl: formOptional(formData, "canonicalUrl"),
    isConfidential: formData.get("isConfidential") === "on",
    visibility: formString(formData, "visibility"),
    featured: formData.get("featured") === "on",
    status: formString(formData, "status"),
    order: formOptional(formData, "order"),
    metaTitle: formOptional(formData, "metaTitle"),
    metaDescription: formOptional(formData, "metaDescription"),
    categoryId: formString(formData, "categoryId"),
    keywords: parseKeywords(formData.get("keywords")),
    techIds: formData.getAll("techIds").filter((v): v is string => typeof v === "string"),
  };
}

function scalarData(d: ProjectInput) {
  const impactMetrics: Prisma.InputJsonValue | typeof Prisma.DbNull = d.impactMetrics
    ? (JSON.parse(d.impactMetrics) as Prisma.InputJsonValue)
    : Prisma.DbNull;

  return {
    title: d.title,
    slug: d.slug,
    summary: d.summary,
    description: d.description ?? null,
    clientName: d.clientName ?? null,
    projectType: d.projectType ?? null,
    industry: d.industry ?? null,
    myRole: d.myRole ?? null,
    startDate: d.startDate ?? null,
    endDate: d.endDate ?? null,
    problem: d.problem ?? null,
    solution: d.solution ?? null,
    features: d.features ?? null,
    outcome: d.outcome ?? null,
    impactMetrics,
    liveUrl: d.liveUrl ?? null,
    githubUrl: d.githubUrl ?? null,
    ogImage: d.ogImage ?? null,
    canonicalUrl: d.canonicalUrl ?? null,
    isConfidential: d.isConfidential,
    visibility: d.visibility,
    featured: d.featured,
    status: d.status,
    order: d.order,
    metaTitle: d.metaTitle ?? null,
    metaDescription: d.metaDescription ?? null,
    keywords: d.keywords,
  };
}

function techCreate(techIds: string[]) {
  return techIds.map((techId) => ({ tech: { connect: { id: techId } } }));
}

function mapWriteError(error: unknown): FormState | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return { ok: false, errors: { slug: ["A project with this slug already exists."] } };
    }
    if (error.code === "P2003" || error.code === "P2025") {
      return {
        ok: false,
        errors: { categoryId: ["Selected category or tech no longer exists."] },
      };
    }
  }
  return null;
}

export async function createProject(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.project.create({
      data: {
        ...scalarData(parsed.data),
        category: { connect: { id: parsed.data.categoryId } },
        techStack: { create: techCreate(parsed.data.techIds) },
      },
    });
  } catch (error) {
    const mapped = mapWriteError(error);
    if (mapped) return mapped;
    throw error;
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(readInput(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        ...scalarData(parsed.data),
        category: { connect: { id: parsed.data.categoryId } },
        techStack: { deleteMany: {}, create: techCreate(parsed.data.techIds) },
      },
    });
  } catch (error) {
    const mapped = mapWriteError(error);
    if (mapped) return mapped;
    throw error;
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;

  // ProjectImage + ProjectTech cascade-delete with the Project.
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function toggleProjectFeatured(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { featured: true },
  });
  if (project) {
    await prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
    });
    revalidatePath("/admin/projects");
  }
}

export async function toggleProjectPublished(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { status: true },
  });
  if (project) {
    const next = project.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.project.update({ where: { id }, data: { status: next } });
    revalidatePath("/admin/projects");
  }
}
