import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const userRouter = router({
  getProfile: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          loyaltyPoints: true,
          lifetimePoints: true,
          tier: true,
          createdAt: true,
        },
      });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { id: input.userId },
        data: { name: input.name },
      });
    }),
});
