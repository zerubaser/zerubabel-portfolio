import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side admin gate for Server Actions and admin pages.
 *
 * Defense-in-depth: middleware already guards /admin/*, but every mutation must
 * independently verify the session — never trust the client. Returns the
 * authenticated session; redirects to the login page otherwise.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}
