import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await auth();

  // Lightweight DB connectivity probe (protected — doubles as an admin health
  // check). Failures degrade gracefully instead of throwing the page.
  let dbStatus = "ok";
  let adminCount = 0;
  try {
    adminCount = await prisma.user.count();
  } catch {
    dbStatus = "unreachable";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Signed in as {session?.user?.email}. Content management (projects,
          services, skills, etc.) arrives in Phase 2.
        </p>
      </div>

      <dl className="grid max-w-sm grid-cols-2 gap-3 rounded-lg border border-border p-4 text-sm">
        <dt className="text-muted-foreground">Database</dt>
        <dd className="font-medium">{dbStatus}</dd>
        <dt className="text-muted-foreground">Registered users</dt>
        <dd className="font-medium">{adminCount}</dd>
      </dl>
    </div>
  );
}
