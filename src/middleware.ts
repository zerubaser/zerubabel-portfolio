import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe middleware built from authConfig only (no Prisma/bcrypt).
// The `authorized` callback in authConfig decides access for /admin/*.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Only guard admin routes; public pages are never matched.
  matcher: ["/admin/:path*"],
};
