import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

/**
 * tRPC initialization for the LuxeVerse backend.
 * Provides typed RPC over HTTP with Zod input validation at boundaries.
 */
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof Error ? null : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required.",
    });
  }
  return next({ ctx: { user: ctx.user } });
});
