import { prisma } from "@/lib/prisma";
import type { CartData, CartItem } from "@/types";
import type { Prisma } from "@prisma/client";

export interface CartService {
  getOrCreate(userId: string | null, sessionId: string): Promise<CartData>;
  addItem(cartId: string, productId: string, variantId: string | null, quantity: number): Promise<CartData>;
  updateItem(itemId: string, quantity: number): Promise<CartData>;
  removeItem(itemId: string): Promise<CartData>;
  clearCart(cartId: string): Promise<CartData>;
}

// Typed Prisma includes to replace 'any'
type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: { select: { name: true; images: { where: { isPrimary: true }; select: { url: true }; take: 1 } } };
        variant: { select: { name: true } };
      };
    };
  };
}>;

function mapCart(cart: CartWithItems): CartData {
  const items: CartItem[] = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    variantId: item.variantId,
    variantName: item.variant?.name ?? null,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    totalPrice: Number(item.unitPrice) * item.quantity,
    imageUrl: item.product.images[0]?.url ?? null,
  }));

  return {
    id: cart.id,
    userId: cart.userId ?? null,
    items,
    subtotal: items.reduce((sum, i) => sum + i.totalPrice, 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    currency: "USD",
  };
}

export function createCartService(): CartService {
  return {
    async getOrCreate(userId, sessionId) {
      let cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                },
              },
              variant: { select: { name: true } },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: userId ? { userId } : { sessionId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                  },
                },
                variant: { select: { name: true } },
              },
            },
          },
        });
      }

      return mapCart(cart);
    },

    async addItem(cartId, productId, variantId, quantity) {
      // Validate inventory
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { price: true, status: true },
      });

      if (!product || product.status !== "ACTIVE") {
        throw new Error("Product unavailable.");
      }

      const existing = await prisma.cartItem.findFirst({
        where: { cartId, productId, variantId },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId,
            productId,
            variantId,
            quantity,
            unitPrice: product.price,
          },
        });
      }

      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                },
              },
              variant: { select: { name: true } },
            },
          },
        },
      });

      if (!cart) throw new Error("Cart not found.");
      return mapCart(cart);
    },

    async updateItem(itemId, quantity) {
      if (quantity < 1) throw new Error("Quantity must be at least 1.");
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });

      const cart = await prisma.cart.findFirst({
        where: { items: { some: { id: itemId } } },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                },
              },
              variant: { select: { name: true } },
            },
          },
        },
      });

      if (!cart) throw new Error("Cart not found.");
      return mapCart(cart);
    },

    async removeItem(itemId) {
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        select: { cartId: true },
      });

      if (!cartItem) throw new Error("Cart item not found.");

      await prisma.cartItem.delete({ where: { id: itemId } });

      const cart = await prisma.cart.findUnique({
        where: { id: cartItem.cartId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                },
              },
              variant: { select: { name: true } },
            },
          },
        },
      });

      if (!cart) throw new Error("Cart not found.");
      return mapCart(cart);
    },

    async clearCart(cartId) {
      await prisma.cartItem.deleteMany({ where: { cartId } });

      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                },
              },
              variant: { select: { name: true } },
            },
          },
        },
      });

      if (!cart) throw new Error("Cart not found.");
      return mapCart(cart);
    },
  };
}
