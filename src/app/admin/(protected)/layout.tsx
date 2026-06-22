import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tech", label: "Tech" },
];

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
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              zerubabel.et · admin
            </p>
            <p className="text-sm font-medium">{session.user.email}</p>
          </div>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
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
