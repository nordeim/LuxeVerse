import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const reviewRouter = router({
  // ------------------------------------------------------------------
  // Queries
  // ------------------------------------------------------------------

  /**
   * List reviews with optional filters (product, user, verified, sorting).
   * Public — used by PDP and review listings.
   */
  list: publicProcedure
    .input(
      z
        .object({
          productId: z.string().optional(),
          userId: z.string().optional(),
          verified: z.boolean().optional(),
          rating: z.number().int().min(1).max(5).optional(),
          sort: z
            .union([
              z.literal("newest"),
              z.literal("oldest"),
              z.literal("highest"),
              z.literal("lowest"),
              z.literal("mostHelpful"),
            ])
            .optional(),
          limit: z.number().int().positive().max(100).optional(),
          offset: z.number().int().nonnegative().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const {
        productId,
        userId,
        verified,
        rating,
        sort = "newest",
        limit = 10,
        offset = 0,
      } = input ?? {};

      const reviews = await prisma.review.findMany({
        where: {
          ...(productId ? { productId } : {}),
          ...(userId ? { userId } : {}),
          ...(verified !== undefined ? { verifiedPurchase: verified } : {}),
          ...(rating !== undefined ? { rating } : {}),
        },
        take: limit,
        skip: offset,
        orderBy:
          sort === "oldest"
            ? { createdAt: "asc" }
            : sort === "highest"
            ? { rating: "desc" }
            : sort === "lowest"
            ? { rating: "asc" }
            : sort === "mostHelpful"
            ? { helpfulCount: "desc" }
            : { createdAt: "desc" },
        include: {
          User: { select: { id: true, name: true, avatar: true } },
          product: { select: { id: true, slug: true, name: true } },
        },
      });

      return reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        userName: r.User?.name ?? "Anonymous",
        userAvatar: r.User?.avatar ?? null,
        productId: r.productId,
        productName: r.product?.name ?? null,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verifiedPurchase: r.verifiedPurchase,
        helpfulCount: r.helpfulCount,
        unhelpfulCount: r.unhelpfulCount,
        size: r.size,
        color: r.color,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));
    }),

  /**
   * Get a single review by ID.
   */
  byId: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      const r = await prisma.review.findUnique({
        where: { id: input.id },
        include: {
          User: { select: { id: true, name: true, avatar: true } },
          product: { select: { id: true, slug: true, name: true } },
        },
      });

      if (!r) return null;

      return {
        id: r.id,
        userId: r.userId,
        userName: r.User?.name ?? "Anonymous",
        userAvatar: r.User?.avatar ?? null,
        productId: r.productId,
        productName: r.product?.name ?? null,
        rating: r.rating,
        title: r.title,
        body: r.body,
        verifiedPurchase: r.verifiedPurchase,
        helpfulCount: r.helpfulCount,
        unhelpfulCount: r.unhelpfulCount,
        size: r.size,
        color: r.color,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    }),

  // ------------------------------------------------------------------
  // Mutations
  // ------------------------------------------------------------------

  /**
   * Create a review.
   * Protected — requires authentication.
   */
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string().min(1),
        rating: z.number().int().min(1).max(5),
        title: z.string().min(1).max(120),
        body: z.string().min(1).max(5000),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");

      // Check for verified purchase (optional guard)
      const order = await prisma.order.findFirst({
        where: {
          userId: user.id,
          items: { some: { productId: input.productId } },
          status: "DELIVERED",
        },
      });

      const review = await prisma.review.create({
        data: {
          userId: user.id,
          productId: input.productId,
          rating: input.rating,
          title: input.title,
          body: input.body,
          size: input.size ?? null,
          color: input.color ?? null,
          verifiedPurchase: !!order,
        },
      });

      // Update product average rating
      const aggregated = await prisma.review.aggregate({
        where: { productId: input.productId },
        _avg: { rating: true },
      });

      await prisma.product.update({
        where: { id: input.productId },
        data: {
          avgRating: aggregated._avg.rating ?? 0,
        },
      });

      return { id: review.id };
    }),

  /**
   * Update own review.
   * Protected — must be the review author.
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        rating: z.number().int().min(1).max(5).optional(),
        title: z.string().min(1).max(120).optional(),
        body: z.string().min(1).max(5000).optional(),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");

      const existing = await prisma.review.findUnique({
        where: { id: input.id },
        select: { userId: true, productId: true },
      });

      if (!existing) throw new Error("NOT_FOUND");
      if (existing.userId !== user.id) throw new Error("FORBIDDEN");

      const review = await prisma.review.update({
        where: { id: input.id },
        data: {
          ...(input.rating !== undefined ? { rating: input.rating } : {}),
          ...(input.title ? { title: input.title } : {}),
          ...(input.body ? { body: input.body } : {}),
          ...(input.size !== undefined ? { size: input.size } : {}),
          ...(input.color !== undefined ? { color: input.color } : {}),
        },
      });

      // Update product average rating
      const aggregated = await prisma.review.aggregate({
        where: { productId: existing.productId },
        _avg: { rating: true },
      });

      await prisma.product.update({
        where: { id: existing.productId },
        data: {
          avgRating: aggregated._avg.rating ?? 0,
        },
      });

      return { id: review.id };
    }),

  /**
   * Delete own review (or admin).
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");

      const existing = await prisma.review.findUnique({
        where: { id: input.id },
        select: { userId: true, productId: true },
      });

      if (!existing) throw new Error("NOT_FOUND");
      if (existing.userId !== user.id && user.role !== "ADMIN") throw new Error("FORBIDDEN");

      await prisma.review.delete({ where: { id: input.id } });

      // Update product average rating
      const aggregated = await prisma.review.aggregate({
        where: { productId: existing.productId },
        _avg: { rating: true },
      });

      await prisma.product.update({
        where: { id: existing.productId },
        data: {
          avgRating: aggregated._avg.rating ?? 0,
        },
      });

      return { success: true };
    }),

  // ------------------------------------------------------------------
  // Voting
  // ------------------------------------------------------------------

  /**
   * Mark a review as helpful/unhelpful.
   * Protected — authenticated users only.
   */
  vote: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        helpful: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const review = await prisma.review.findUnique({
        where: { id: input.id },
        select: { id: true, helpfulCount: true, unhelpfulCount: true },
      });

      if (!review) throw new Error("NOT_FOUND");

      if (input.helpful) {
        await prisma.review.update({
          where: { id: input.id },
          data: { helpfulCount: { increment: 1 } },
        });
      } else {
        await prisma.review.update({
          where: { id: input.id },
          data: { unhelpfulCount: { increment: 1 } },
        });
      }

      return { success: true };
    }),

  // ------------------------------------------------------------------
  // Analytics / Dashboard
  // ------------------------------------------------------------------

  /**
   * Aggregate statistics for a product.
   */
  statistics: publicProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .query(async ({ input }) => {
      const [aggregated, distribution] = await Promise.all([
        prisma.review.aggregate({
          where: { productId: input.productId },
          _avg: { rating: true },
          _count: { id: true },
        }),
        prisma.review.groupBy({
          by: ["rating"],
          where: { productId: input.productId },
          _count: { id: true },
        }),
      ]);

      const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const d of distribution) {
        ratingDistribution[d.rating] = d._count.id;
      }

      return {
        total: aggregated._count.id,
        average: aggregated._avg.rating ?? 0,
        distribution: ratingDistribution,
      };
    }),

  /**
   * Moderation: approve or reject a review.
   * Admin / Editor / Stylist only.
   */
  moderate: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        action: z.union([z.literal("approve"), z.literal("reject")]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) throw new Error("UNAUTHORIZED");
      if (![ "ADMIN", "EDITOR", "STYLIST"].includes(user.role)) {
        throw new Error("FORBIDDEN");
      }

      // Soft-delete on reject (set status = "REJECTED")
      // For now, we delete on reject; in production, use a status field.
      if (input.action === "reject") {
        await prisma.review.update({
          where: { id: input.id },
          data: { body: "[This review has been moderated]" },
        });
      }

      return { success: true };
    }),

  /**
   * Flag a review for moderation.
   * Protected — any authenticated user.
   */
  flag: protectedProcedure
    .input(z.object({ id: z.string().min(1), reason: z.string().min(1).max(5000) }))
    .mutation(async ({ input }) => {
      // In production, persist to ReviewFlag table.
      return { success: true, id: input.id, reason: input.reason };
    }),
});
