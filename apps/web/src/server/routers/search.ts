import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const searchRouter = router({
  query: publicProcedure
    .input(
      z.object({
        q: z.string().min(1).max(100),
        limit: z.number().int().positive().max(50).optional(),
        category: z.string().optional(),
        minPrice: z.number().nonnegative().optional(),
        maxPrice: z.number().nonnegative().optional(),
        sort: z.union([z.literal("relevant"), z.literal("price-asc"), z.literal("price-desc"), z.literal("newest")]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { q, limit = 12, category, minPrice, maxPrice, sort } = input;

      // Full-text search on name, description, tags
      const products = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          AND: [
            {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { tags: { some: { name: { contains: q, mode: "insensitive" } } } },
              ],
            },
            category ? { category: { slug: category } } : {},
            minPrice !== undefined ? { price: { gte: minPrice } } : {},
            maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
          ],
        },
        take: limit,
        orderBy:
          sort === "price-asc"
            ? { price: "asc" }
            : sort === "price-desc"
            ? { price: "desc" }
            : sort === "newest"
            ? { createdAt: "desc" }
            : { createdAt: "desc" },
        include: {
          images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
          category: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
          _count: { select: { variants: true, reviews: true } },
        },
      });

      return products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        primaryImage: p.images[0]?.url ?? null,
        category: p.category?.name ?? null,
        categorySlug: p.category?.slug ?? null,
        brand: p.brand?.name ?? null,
        rating: null,
        reviewCount: 0,
        status: p.status as "ACTIVE" | "DRAFT" | "ARCHIVED",
      }));
    }),

  suggestions: publicProcedure
    .input(z.object({ q: z.string().min(1).max(100), limit: z.number().int().positive().max(10).optional() }))
    .query(async ({ input }) => {
      const { q, limit = 5 } = input;

      const products = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [{ name: { contains: q, mode: "insensitive" } }, { tags: { some: { name: { contains: q, mode: "insensitive" } } } }],
        },
        take: limit,
        select: { name: true, slug: true },
      });

      return products.map((p) => ({ name: p.name, slug: p.slug }));
    }),

  facets: publicProcedure
    .input(z.object({ q: z.string().min(1).max(100) }))
    .query(async ({ input }) => {
      const { q } = input;

      const [categoryFacets, priceRange, brandFacets] = await Promise.all([
        // Category counts
        prisma.product.groupBy({
          by: ["categoryId"],
          where: {
            status: "ACTIVE",
            OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
          },
          _count: { id: true },
        }),
        // Price range
        prisma.product.aggregate({
          where: {
            status: "ACTIVE",
            OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
          },
          _min: { price: true },
          _max: { price: true },
        }),
        // Brand counts
        prisma.product.groupBy({
          by: ["brandId"],
          where: {
            status: "ACTIVE",
            OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
          },
          _count: { id: true },
        }),
      ]);

      return {
        categories: categoryFacets.map((c) => ({ categoryId: c.categoryId, count: c._count.id })),
        brands: brandFacets.map((b) => ({ brandId: b.brandId, count: b._count.id })),
        priceRange: { min: priceRange._min.price, max: priceRange._max.price },
      };
    }),

  trending: publicProcedure.query(async () => {
    // In production: use analytics or sales data
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { name: true },
    });
    return products.map((p) => p.name);
  }),
});
