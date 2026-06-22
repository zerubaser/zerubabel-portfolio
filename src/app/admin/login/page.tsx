import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm rounded-xl border border-border p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Sign in to manage zerubabel.et.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
