import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES: { name: string; slug: string; order: number }[] = [
  { name: "ERP / SaaS", slug: "erp-saas", order: 1 },
  { name: "Healthcare", slug: "healthcare", order: 2 },
  { name: "LMS / Education", slug: "lms-education", order: 3 },
  { name: "Mobile Apps", slug: "mobile-apps", order: 4 },
  { name: "Backend APIs", slug: "backend-apis", order: 5 },
  { name: "WordPress", slug: "wordpress", order: 6 },
  { name: "Business Websites", slug: "business-websites", order: 7 },
  { name: "Nonprofit", slug: "nonprofit", order: 8 },
];

const TECHS: { name: string; slug: string; color?: string }[] = [
  { name: "Next.js", slug: "nextjs", color: "#000000" },
  { name: "React", slug: "react", color: "#61dafb" },
  { name: "TypeScript", slug: "typescript", color: "#3178c6" },
  { name: "Tailwind CSS", slug: "tailwind-css", color: "#38bdf8" },
  { name: "Laravel", slug: "laravel", color: "#ff2d20" },
  { name: "PHP", slug: "php", color: "#777bb4" },
  { name: "Django", slug: "django", color: "#092e20" },
  { name: "Python", slug: "python", color: "#3776ab" },
  { name: "ASP.NET Core", slug: "aspnet-core", color: "#512bd4" },
  { name: "Node.js", slug: "nodejs", color: "#339933" },
  { name: "Flutter", slug: "flutter", color: "#02569b" },
  { name: "Dart", slug: "dart", color: "#0175c2" },
  { name: "PostgreSQL", slug: "postgresql", color: "#4169e1" },
  { name: "MySQL", slug: "mysql", color: "#4479a1" },
  { name: "SQL Server", slug: "sql-server", color: "#cc2927" },
  { name: "Firebase", slug: "firebase", color: "#ffca28" },
  { name: "WordPress", slug: "wordpress", color: "#21759b" },
];

const SERVICES: { title: string; slug: string; description: string; order: number }[] = [
  { title: "Mobile App Development", slug: "mobile-app-development", description: "Flutter mobile apps with authentication, payments, and real-time features.", order: 1 },
  { title: "Backend API Development", slug: "backend-api-development", description: "REST APIs with authentication, role-based access, and reporting.", order: 2 },
  { title: "ERP / SaaS Development", slug: "erp-saas-development", description: "Multi-tenant business platforms, dashboards, and module gating.", order: 3 },
  { title: "Clinic / Lab System Development", slug: "clinic-lab-system-development", description: "Healthcare systems with lab, billing, and analyzer workflows.", order: 4 },
  { title: "Business System Development", slug: "business-system-development", description: "Custom management systems for operations, HR, and inventory.", order: 5 },
  { title: "WordPress Development", slug: "wordpress-development", description: "WordPress builds, fixes, plugin work, and performance optimization.", order: 6 },
  { title: "Performance Optimization", slug: "performance-optimization", description: "Speed, caching, and Core Web Vitals improvements.", order: 7 },
  { title: "Full Project Development", slug: "full-project-development", description: "End-to-end delivery from design to deployment.", order: 8 },
];

const SKILL_GROUPS: { name: string; slug: string; order: number }[] = [
  { name: "Frontend", slug: "frontend", order: 1 },
  { name: "Backend", slug: "backend", order: 2 },
  { name: "Mobile", slug: "mobile", order: 3 },
  { name: "Databases", slug: "databases", order: 4 },
  { name: "CMS / WordPress", slug: "cms-wordpress", order: 5 },
  { name: "DevOps", slug: "devops", order: 6 },
  { name: "AI Tools", slug: "ai-tools", order: 7 },
];

const SKILLS: { group: string; name: string; tech: string | null; order: number }[] = [
  { group: "frontend", name: "Next.js", tech: "nextjs", order: 1 },
  { group: "frontend", name: "React", tech: "react", order: 2 },
  { group: "frontend", name: "TypeScript", tech: "typescript", order: 3 },
  { group: "frontend", name: "Tailwind CSS", tech: "tailwind-css", order: 4 },
  { group: "backend", name: "Laravel", tech: "laravel", order: 1 },
  { group: "backend", name: "Django", tech: "django", order: 2 },
  { group: "backend", name: "ASP.NET Core", tech: "aspnet-core", order: 3 },
  { group: "backend", name: "Node.js", tech: "nodejs", order: 4 },
  { group: "mobile", name: "Flutter", tech: "flutter", order: 1 },
  { group: "mobile", name: "Dart", tech: "dart", order: 2 },
  { group: "databases", name: "PostgreSQL", tech: "postgresql", order: 1 },
  { group: "databases", name: "MySQL", tech: "mysql", order: 2 },
  { group: "databases", name: "SQL Server", tech: "sql-server", order: 3 },
  { group: "cms-wordpress", name: "WordPress", tech: "wordpress", order: 1 },
  { group: "devops", name: "Docker", tech: null, order: 1 },
  { group: "devops", name: "AWS", tech: null, order: 2 },
  { group: "ai-tools", name: "Claude Code", tech: null, order: 1 },
];

const TAGS: { name: string; slug: string }[] = [
  { name: "Devlog", slug: "devlog" },
  { name: "Case Study", slug: "case-study" },
  { name: "Tutorial", slug: "tutorial" },
  { name: "Announcement", slug: "announcement" },
];

/**
 * Idempotent seed. Existing rows are never overwritten. Real credentials live
 * only in the (gitignored) .env. Facts that need owner confirmation (bio,
 * experience entries) are intentionally left out rather than invented.
 */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Seed aborted: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.");
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists (${email}); nothing to do.`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: "Administrator", role: "ADMIN" },
  });
  console.log(`Created admin user: ${user.email}`);
}

async function seedCategories() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }
  console.log(`Ensured ${CATEGORIES.length} categories.`);
}

async function seedTechs() {
  for (const tech of TECHS) {
    await prisma.tech.upsert({ where: { slug: tech.slug }, update: {}, create: tech });
  }
  console.log(`Ensured ${TECHS.length} tech entries.`);
}

async function seedServices() {
  for (const service of SERVICES) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: { ...service, status: "PUBLISHED" },
    });
  }
  console.log(`Ensured ${SERVICES.length} services.`);
}

async function seedSkillGroups() {
  for (const group of SKILL_GROUPS) {
    await prisma.skillGroup.upsert({ where: { slug: group.slug }, update: {}, create: group });
  }
  console.log(`Ensured ${SKILL_GROUPS.length} skill groups.`);
}

async function seedSkills() {
  // Skills have no natural unique key, so guard by (name, group) to stay idempotent.
  for (const skill of SKILLS) {
    const group = await prisma.skillGroup.findUnique({ where: { slug: skill.group } });
    if (!group) continue;
    const exists = await prisma.skill.findFirst({ where: { name: skill.name, groupId: group.id } });
    if (exists) continue;
    const tech = skill.tech ? await prisma.tech.findUnique({ where: { slug: skill.tech } }) : null;
    await prisma.skill.create({
      data: {
        name: skill.name,
        order: skill.order,
        group: { connect: { id: group.id } },
        ...(tech ? { tech: { connect: { id: tech.id } } } : {}),
      },
    });
  }
  console.log(`Ensured ${SKILLS.length} skills.`);
}

async function seedTags() {
  for (const tag of TAGS) {
    await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag });
  }
  console.log(`Ensured ${TAGS.length} tags.`);
}

async function seedSiteSettings() {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    console.log("Site settings already exist; nothing to do.");
    return;
  }
  await prisma.siteSettings.create({
    data: {
      siteName: "Zerubabel Shimeles",
      siteUrl: "https://zerubabel.et",
      title: "Full-Stack Developer",
      heroTitle: "Zerubabel Shimeles",
      heroSubtitle: "Full-stack developer building real business systems.",
      location: "Addis Ababa, Ethiopia",
      keywords: ["full-stack developer", "Addis Ababa", "Next.js", "Laravel", "Flutter"],
      // bio, resumeUrl, socialLinks: TODO — owner to fill in via /admin/settings.
    },
  });
  console.log("Created default site settings.");
}

async function main() {
  await seedAdmin();
  await seedCategories();
  await seedTechs();
  await seedServices();
  await seedSkillGroups();
  await seedSkills();
  await seedTags();
  await seedSiteSettings();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
