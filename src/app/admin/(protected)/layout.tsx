import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";

/**
 * Protected admin shell. Middleware already gates /admin/*, but this
 * server-side check is defense-in-depth and provides the session for the shell.
 * The login page lives outside this route group, so it is never wrapped here.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const unreadCount = await prisma.message.count({ where: { read: false } });

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <AdminShell email={session.user.email ?? ""} unreadCount={unreadCount} logoutAction={logout}>
      {children}
    </AdminShell>
  );
}
