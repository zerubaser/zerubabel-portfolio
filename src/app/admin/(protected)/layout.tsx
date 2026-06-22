import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

/**
 * Protected admin shell. Middleware already gates /admin/*, but this
 * server-side check is defense-in-depth and gives us the session for the shell.
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

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            zerubabel.et · admin
          </p>
          <p className="text-sm font-medium">{session.user.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            Log out
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
