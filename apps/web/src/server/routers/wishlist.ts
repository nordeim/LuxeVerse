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
        include: { items: { include: { product: true } } },
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
      // Find or create the user's default wishlist
      let wishlist = await prisma.wishlist.findFirst({
        where: { userId: ctx.user.id },
      });
      if (!wishlist) {
        wishlist = await prisma.wishlist.create({
          data: { userId: ctx.user.id, name: "My Wishlist" },
        });
      }
      return prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: input.productId,
          variantId: input.variantId ?? null,
        },
      });
    }),

  removeItem: protectedProcedure
    .input(z.object({ productId: z.string(), variantId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      const wishlist = await prisma.wishlist.findFirst({
        where: { userId: ctx.user.id },
      });
      if (!wishlist) throw new Error("Wishlist not found");
      return prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId: input.productId,
          ...(input.variantId ? { variantId: input.variantId } : {}),
        },
      });
    }),
});
