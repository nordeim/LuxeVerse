import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { createLoyaltyService } from "../loyalty.service";
import type { PointHistoryItem } from "../loyalty.service";
import { prisma } from "@/lib/prisma";

export const loyaltyRouter = router({
  getHistory: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const service = createLoyaltyService(prisma);
      return service.getHistory(input.userId) as Promise<PointHistoryItem[]>;
    }),

  getBalance: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          loyaltyPoints: true,
          lifetimePoints: true,
          tier: true,
        },
      });
      return user;
    }),

  redeemPoints: protectedProcedure
    .input(z.object({ userId: z.string(), points: z.number().min(1) }))
    .mutation(async ({ input }) => {
      const service = createLoyaltyService(prisma);
      return service.redeemPoints(input.userId, input.points);
    }),
});
