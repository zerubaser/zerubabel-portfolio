import { PrismaClient } from "@prisma/client";

// Singleton Prisma client. Avoids exhausting the (intentionally low) Postgres
// connection pool during dev hot-reload. Production DATABASE_URL sets
// ?connection_limit=5 (Rule 6).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
