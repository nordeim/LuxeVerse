import NextAuth, { type AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/crypto";
import { loginSchema } from "@/lib/schemas";

export type UserRole = "CUSTOMER" | "ADMIN" | "EDITOR" | "STYLIST";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

// Extend next-auth types
declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & { id: string; role: UserRole };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  }
}

// NextAuth v4 configuration for App Router
const authConfig: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) return null;
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as AuthUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
};

// v4: NextAuth returns the handler function
const handler = NextAuth(authConfig);

// Export for App Router API route
export { handler as GET, handler as POST };

// Export config for getServerSession
export { authConfig as authOptions };
