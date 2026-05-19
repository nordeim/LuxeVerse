import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { createCartService } from "../services/cart.service";

export const orderRouter = router({
  checkout: publicProcedure
    .input(
      z.object({
        cartId: z.string(),
        address: z.object({
          firstName: z.string(),
          lastName: z.string(),
          line1: z.string(),
          line2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx }) => {
      const cartService = createCartService();
      const cart = await cartService.getOrCreate(ctx.user?.id ?? null, ctx.sessionId ?? crypto.randomUUID());

      if (cart.items.length === 0) {
        throw new Error("Cart is empty.");
      }

      // Calculate totals
      const subtotal = cart.subtotal;
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 500 ? 0 : 25; // Free shipping over $500
      const total = subtotal + tax + shipping;

      // Create Stripe PaymentIntent
      // In production: const paymentIntent = await stripe.paymentIntents.create({ ... });
      const paymentIntent = {
        id: `pi_${crypto.randomUUID()}`,
        client_secret: `secret_${crypto.randomUUID()}`,
      };

      const order = await prisma.order.create({
        data: {
          orderNumber: `LV-${Date.now()}`,
          userId: ctx.user?.id ?? cart.userId ?? "guest",
          subtotal: subtotal / 100,
          tax: tax / 100,
          shipping: shipping / 100,
          total: total / 100,
          currency: "USD",
          paymentIntentId: paymentIntent.id,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice / 100,
              totalPrice: item.totalPrice / 100,
            })),
          },
        },
      });

      // Clear cart after order
      await cartService.clearCart(cart.id);

      return {
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientSecret: paymentIntent.client_secret,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const order = await prisma.order.findUnique({
        where: { id: input.id },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      });

      if (!order) throw new Error("Order not found.");

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status as "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED",
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        shipping: Number(order.shipping),
        total: Number(order.total),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        })),
      };
    }),
});
