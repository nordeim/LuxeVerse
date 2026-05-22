import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

/**
 * SavedOutfit Router - MEP §4.1 (Scale & Social)
 * CRUD for AI-generated outfits saved by users.
 */

export const savedOutfitRouter = router({
  /**
   * List saved outfits for the current user.
   */
  list: protectedProcedure
    .input(z.object({ limit: z.number().int().positive().max(50).optional() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");

      const outfits = await prisma.savedOutfit.findMany({
        where: { userId: user.id },
        take: input.limit ?? 20,
        orderBy: { createdAt: "desc" },
        include: { User: { select: { id: true, name: true } } },
      });

      return outfits.map((o) => ({
        id: o.id,
        name: o.name,
        items: o.items as Array<{ productId: string; name: string; price: number }>,
        occasion: o.occasion,
        season: o.season,
        aiGenerated: o.aiGenerated,
        createdAt: o.createdAt.toISOString(),
      }));
    }),

  /**
   * Create a new saved outfit.
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(120),
        items: z.array(
          z.object({
            productId: z.string().min(1),
            name: z.string().min(1),
            price: z.number().nonnegative(),
          })
        ),
        occasion: z.string().optional(),
        season: z.string().optional(),
        aiGenerated: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");

      const outfit = await prisma.savedOutfit.create({
        data: {
          userId: user.id,
          name: input.name,
          items: input.items,
          occasion: input.occasion ?? null,
          season: input.season ?? null,
          aiGenerated: input.aiGenerated ?? false,
        },
      });

      return { id: outfit.id };
    }),

  /**
   * Delete a saved outfit (must be the owner).
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");

      const existing = await prisma.savedOutfit.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!existing) throw new Error("NOT_FOUND");
      if (existing.userId !== user.id) throw new Error("FORBIDDEN");

      await prisma.savedOutfit.delete({ where: { id: input.id } });
      return { success: true };
    }),

  /**
   * Update a saved outfit's name or items.
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).max(120).optional(),
        items: z
          .array(
            z.object({
              productId: z.string().min(1),
              name: z.string().min(1),
              price: z.number().nonnegative(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");

      const existing = await prisma.savedOutfit.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!existing) throw new Error("NOT_FOUND");
      if (existing.userId !== user.id) throw new Error("FORBIDDEN");

      const outfit = await prisma.savedOutfit.update({
        where: { id: input.id },
        data: {
          ...(input.name ? { name: input.name } : {}),
          ...(input.items ? { items: input.items } : {}),
        },
      });

      return { id: outfit.id };
    }),
});
