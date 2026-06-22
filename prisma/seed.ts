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

/**
 * Seeds the first admin user plus baseline categories and tech.
 *
 * Rules:
 * - ADMIN_EMAIL and ADMIN_PASSWORD must be provided (fails clearly otherwise).
 * - The password is hashed with bcrypt; the plaintext is never stored.
 * - Idempotent: existing admin/category/tech rows are left untouched.
 * - Real credentials live only in the (gitignored) .env, never in the repo.
 */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Seed aborted: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.",
    );
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
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(`Ensured ${CATEGORIES.length} categories.`);
}

async function seedTechs() {
  for (const tech of TECHS) {
    await prisma.tech.upsert({
      where: { slug: tech.slug },
      update: {},
      create: tech,
    });
  }
  console.log(`Ensured ${TECHS.length} tech entries.`);
}

async function main() {
  await seedAdmin();
  await seedCategories();
  await seedTechs();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
