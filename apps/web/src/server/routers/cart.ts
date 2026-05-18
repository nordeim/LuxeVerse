import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { createCartService } from "../services/cart.service";

export const cartRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    const service = createCartService();
    return service.getOrCreate(ctx.user?.id ?? null, ctx.sessionId ?? crypto.randomUUID());
  }),

  addItem: publicProcedure
    .input(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1).nullable(),
        quantity: z.number().int().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = createCartService();
      const cart = await service.getOrCreate(
        ctx.user?.id ?? null,
        ctx.sessionId ?? crypto.randomUUID()
      );
      return service.addItem(
        cart.id,
        input.productId,
        input.variantId,
        input.quantity ?? 1
      );
    }),

  updateItem: publicProcedure
    .input(
      z.object({
        itemId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = createCartService();
      return service.updateItem(input.itemId, input.quantity);
    }),

  removeItem: publicProcedure
    .input(z.object({ itemId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const service = createCartService();
      // getOrCreate not needed for remove, service already handles
      const cart = await service.getOrCreate(
        ctx.user?.id ?? null,
        ctx.sessionId ?? crypto.randomUUID()
      );
      return service.removeItem(input.itemId);
    }),

  clearCart: publicProcedure
    .input(z.object({ cartId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const service = createCartService();
      return service.clearCart(input.cartId);
    }),
});
