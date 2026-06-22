import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js (NextAuth v5) skeleton.
 *
 * Rule 4: the Credentials provider MUST use the JWT session strategy. There are
 * NO Prisma session/account tables — the session lives entirely in a signed JWT
 * cookie. Do not switch to a database session strategy without revisiting the
 * schema and the auth ADR.
 *
 * Phase 1 will implement real credential verification (look up the User by
 * email, verify the hashed password, return { id, email, role }) and the admin
 * route guard in middleware.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // TODO(Phase 1): verify against the User table with a hashed password.
      authorize: async () => null,
    }),
  ],
});
