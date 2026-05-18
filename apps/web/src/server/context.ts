import type { NextRequest } from "next/server";
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
  const sessionToken = req.cookies.get("session-token")?.value ?? null;
  const sessionId =
    req.cookies.get("cart-session")?.value ?? crypto.randomUUID();

  let user: Context["user"] = null;

  if (sessionToken) {
    // Production: verify JWT / session via NextAuth
    // user = await verifySession(sessionToken);
    // For now, leave as null until NextAuth wiring is complete
  }

  return { prisma, user, sessionId };
}
