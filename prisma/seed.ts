import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seeds the first admin user from environment variables.
 *
 * Rules:
 * - ADMIN_EMAIL and ADMIN_PASSWORD must be provided (fails clearly otherwise).
 * - The password is hashed with bcrypt; the plaintext is never stored.
 * - Idempotent: if an admin with that email already exists, it is left as-is.
 * - Real credentials live only in the (gitignored) .env, never in the repo.
 */
async function main() {
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
    data: {
      email,
      passwordHash,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  console.log(`Created admin user: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
