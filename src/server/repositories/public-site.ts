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

/**
 * Sanitized public view of a single project.
 *
 * Returns a hand-shaped object — NOT the raw Prisma row — so that sensitive
 * case-study fields (problem/solution/features/outcome/metrics/live+github URLs
 * and the gallery) are stripped on the server for LIMITED or isConfidential
 * projects. This keeps them out of the rendered HTML *and* the RSC flight
 * payload, which a raw row would otherwise serialize even when not displayed.
 */
export async function getPublicProjectViewBySlug(slug: string) {
  const p = await prisma.project.findFirst({
    where: { slug, ...PUBLIC_PROJECT_WHERE },
    include: {
      category: { select: { name: true, slug: true } },
      techStack: { include: { tech: { select: { name: true, slug: true } } } },
      images: { orderBy: { order: "asc" } },
    },
  });
  if (!p) return null;

  const showFull = p.visibility === "PUBLIC" && !p.isConfidential;
  const cover = p.images.find((i) => i.type === "COVER") ?? p.images[0] ?? null;

  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category,
    techStack: p.techStack,
    projectType: p.projectType,
    industry: p.industry,
    myRole: p.myRole,
    keywords: p.keywords,
    // SEO fields (safe to expose in <meta>/JSON-LD)
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    ogImage: p.ogImage,
    canonicalUrl: p.canonicalUrl,
    cover: cover ? { url: cover.url, altText: cover.altText } : null,
    showFull,
    // Sensitive — only present for a full public case study.
    problem: showFull ? p.problem : null,
    solution: showFull ? p.solution : null,
    features: showFull ? p.features : null,
    outcome: showFull ? p.outcome : null,
    impactMetrics: showFull ? p.impactMetrics : null,
    liveUrl: showFull ? p.liveUrl : null,
    githubUrl: showFull ? p.githubUrl : null,
    gallery: showFull
      ? p.images
          .filter((i) => i.id !== cover?.id)
          .map((i) => ({ id: i.id, url: i.url, altText: i.altText, caption: i.caption }))
      : [],
  };
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
