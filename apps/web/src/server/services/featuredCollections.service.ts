import { prisma } from "@/lib/prisma";

export interface FeaturedCollection {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  productCount: number;
}

export interface FeaturedCollectionsService {
  list(): Promise<FeaturedCollection[]>;
}

function mapCollection(item: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}): FeaturedCollection {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description,
    image: item.image,
    productCount: item._count.products,
  };
}

export function createFeaturedCollectionsService(): FeaturedCollectionsService {
  return {
    async list() {
      const collections = await prisma.collection.findMany({
        where: {
          isFeatured: true,
          isActive: true,
          type: { in: ["MANUAL", "SEASONAL", "EDITORIAL"] },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          image: true,
          _count: { select: { products: true } },
        },
      });
      return collections.map(mapCollection);
    },
  };
}
