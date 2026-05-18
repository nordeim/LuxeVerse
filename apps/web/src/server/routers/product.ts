import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { createProductService } from "../services/product.service";

export const productRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().positive().optional(),
          category: z.string().optional(),
          sort: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const service = createProductService();
      return service.list({
        limit: input?.limit ?? 12,
        category: input?.category,
        sort: input?.sort,
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const service = createProductService();
      const product = await service.getBySlug(input.slug);
      if (!product) throw new Error("Product not found.");
      return product;
    }),

  getRelated: publicProcedure
    .input(
      z.object({
        productId: z.string().min(1),
        limit: z.number().int().positive().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = createProductService();
      return service.getRelated(input.productId, input.limit ?? 4);
    }),
});
