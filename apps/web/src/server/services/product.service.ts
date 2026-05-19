import { prisma } from "@/lib/prisma";
import type { ProductListItem, ProductDetail } from "@/types";
import type { PrismaClient } from "@prisma/client";

export interface ProductService {
  list(filters: { category?: string; sort?: string; limit?: number }): Promise<ProductListItem[]>;
  getBySlug(slug: string): Promise<ProductDetail | null>;
  getRelated(productId: string, limit?: number): Promise<ProductListItem[]>;
}

export interface ProductServiceContext {
  prisma: PrismaClient;
}

export function createProductService(): ProductService {
  return {
    async list({ limit = 12 } = {}) {
      const products = await prisma.product.findMany({
        where: { status: "ACTIVE" },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            where: { isPrimary: true },
            select: { url: true },
            take: 1,
          },
          _count: { select: { variants: true } },
        },
      });

      return products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        primaryImage: p.images[0]?.url ?? null,
        status: p.status as "ACTIVE" | "DRAFT" | "ARCHIVED",
      }));
    },

    async getBySlug(slug: string) {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          variants: { where: { status: "ACTIVE" } },
        },
      });

      if (!product) return null;

      return {
        id: product.id,
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        status: product.status as "ACTIVE" | "DRAFT" | "ARCHIVED",
        featured: product.featured,
        images: product.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.altText,
          width: img.width,
          height: img.height,
          isPrimary: img.isPrimary,
        })),
        variants: product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          price: v.price ? Number(v.price) : null,
          inventory: v.inventory,
        })),
      };
    },

    async getRelated(productId: string, limit = 4) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });

      if (!product) return [];

      const related = await prisma.product.findMany({
        where: { status: "ACTIVE", id: { not: productId } },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
        },
      });

      return related.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        primaryImage: p.images[0]?.url ?? null,
        status: p.status as "ACTIVE" | "DRAFT" | "ARCHIVED",
      }));
    },
  };
}
