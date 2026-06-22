import { prisma } from "@/lib/prisma";

/**
 * Public read layer. Only ever returns published, non-confidential content.
 * Admin mutations live elsewhere; nothing here writes.
 */

// Published + not confidential — the baseline gate for anything project-related.
const PUBLIC_PROJECT_WHERE = {
  status: "PUBLISHED",
  visibility: { not: "CONFIDENTIAL" },
} as const;

const projectCardInclude = {
  category: { select: { name: true, slug: true } },
  images: { where: { type: "COVER" as const }, orderBy: { order: "asc" as const }, take: 1 },
  techStack: { include: { tech: { select: { name: true, slug: true } } } },
} as const;

export async function getSiteSettings() {
  return prisma.siteSettings.findFirst();
}

export async function getFeaturedProjects(limit = 6) {
  return prisma.project.findMany({
    where: { ...PUBLIC_PROJECT_WHERE, featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: limit,
    include: projectCardInclude,
  });
}

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: PUBLIC_PROJECT_WHERE,
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    include: projectCardInclude,
  });
}

export async function getPublicProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, ...PUBLIC_PROJECT_WHERE },
    include: {
      category: { select: { name: true, slug: true } },
      techStack: { include: { tech: { select: { name: true, slug: true } } } },
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function getPublishedServices() {
  return prisma.service.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });
}

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { tags: { include: { tag: { select: { name: true, slug: true } } } } },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { tags: { include: { tag: { select: { name: true, slug: true } } } } },
  });
}

export async function getPublishedTestimonials(limit?: number) {
  return prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    ...(limit ? { take: limit } : {}),
  });
}

export async function getPublishedExperience() {
  return prisma.experience.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
}

export async function getSkillGroupsWithSkills() {
  return prisma.skillGroup.findMany({
    orderBy: { order: "asc" },
    include: {
      skills: {
        orderBy: { order: "asc" },
        include: { tech: { select: { name: true } } },
      },
    },
  });
}

/** Slugs of published, non-confidential projects (for the sitemap). */
export async function getPublicProjectSlugs() {
  return prisma.project.findMany({
    where: PUBLIC_PROJECT_WHERE,
    select: { slug: true, updatedAt: true },
  });
}

/** Slugs of published posts (for the sitemap). */
export async function getPublishedPostSlugs() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
}
