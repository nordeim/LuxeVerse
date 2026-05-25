import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

/**
 * tRPC context for each incoming request.
 * Extracts user from session/cookies and provides Prisma instance.
 */
export interface Context {
  prisma: typeof prisma;
  user: { id: string; email: string; role: string } | null;
  sessionId: string | null;
}

export async function createContext(req: NextRequest): Promise<Context> {
  const sessionId =
    req.cookies.get("cart-session")?.value ?? crypto.randomUUID();

  // Verify the NextAuth JWT token from cookies (App Router compatible)
  let user: Context["user"] = null;

  if (process.env.AUTH_SECRET) {
    // Type cast needed because getToken expects a req with a specific shape
    // that NextRequest satisfies at runtime.
    const token = await getToken({
      req: req as unknown as Parameters<typeof getToken>[0]["req"],
      secret: process.env.AUTH_SECRET,
    });

    if (token?.id && typeof token.id === "string") {
      user = {
        id: token.id,
        email: (token.email as string) ?? "",
        role: (token.role as string) || "CUSTOMER",
      };
    }
  }

  return { prisma, user, sessionId };
}
