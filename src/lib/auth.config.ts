import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Edge-safe Auth.js config (no Node-only deps like Prisma/bcrypt).
 *
 * This is what `middleware.ts` instantiates, so it must stay importable from the
 * Edge runtime. The real Credentials provider (which needs Prisma + bcrypt) is
 * added separately in `auth.ts`.
 *
 * Rule 4: JWT session strategy — no database session tables.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isOnLogin = pathname === "/admin/login";
      const isOnAdmin = pathname.startsWith("/admin");

      if (isOnLogin) {
        // Already-authenticated admins should not see the login page.
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
        return true;
      }

      if (isOnAdmin) {
        // Protect every other /admin/* route. Returning false makes Auth.js
        // redirect to the configured signIn page (/admin/login).
        return isLoggedIn;
      }

      // Public routes are never gated here.
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role = token.role as Role | undefined;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
