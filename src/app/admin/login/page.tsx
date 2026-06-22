import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm rounded-xl border border-border p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Placeholder. Credentials sign-in with a JWT session is implemented in
          Phase 1 (admin auth).
        </p>
      </div>
    </main>
  );
}
