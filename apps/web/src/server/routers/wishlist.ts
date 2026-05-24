import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const wishlistRouter = router({
  list: protectedProcedure
    .input(z.void().optional())
    .query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return prisma.wishlist.findMany({
        where: { userId: ctx.user.id },
      });
    }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return prisma.wishlist.create({
        data: {
          userId: ctx.user.id,
          productId: input.productId,
        },
      });
    }),

  removeItem: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return prisma.wishlist.deleteMany({
        where: { userId: ctx.user.id, productId: input.productId },
      });
    }),
});
