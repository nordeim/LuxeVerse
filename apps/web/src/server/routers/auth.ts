import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import { prisma } from "@/lib/prisma";

/**
 * Auth tRPC router for user profile and settings.
 * All mutations are protected and require an active session.
 */

export const authRouter = router({
  /** Get current user profile */
  profile: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        // ... add more fields as needed
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),

  /** Update user profile */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await prisma.user.update({
        where: { id: ctx.user!.id },
        data: { name: input.name },
        select: { id: true, name: true, email: true },
      });

      return updated;
    }),
});

export type AuthRouter = typeof authRouter;
