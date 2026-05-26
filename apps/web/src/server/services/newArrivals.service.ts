import { prisma } from "@/lib/prisma";

export interface NewArrival {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  category: string;
  brandName?: string | null;
  isNew?: boolean;
}

export interface NewArrivalsService {
  list(): Promise<NewArrival[]>;
}

export function createNewArrivalsService(): NewArrivalsService {
  return {
    async list() {
      const products = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          newArrival: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          slug: true,
          name: true,
          subtitle: true,
          price: true,
          compareAtPrice: true,
          images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
          category: { select: { name: true } },
          brand: { select: { name: true } },
          newArrival: true,
        },
      });

      return products.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle,
        price: Number(item.price),
        compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
        image: item.images[0]?.url ?? null,
        category: item.category.name,
        brandName: item.brand?.name ?? null,
        isNew: item.newArrival,
      }));
    },
  };
}
