import { prisma } from "@/lib/prisma";

export interface EditorialItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
  author: string;
  category: string;
  featured: boolean;
  readTime: number; // approximate minutes based on word count
  publishedAt: Date | null;
}

export interface EditorialService {
  listAll(): Promise<EditorialItem[]>;
  listFeatured(): Promise<EditorialItem[]>;
  getBySlug(slug: string): Promise<EditorialItem | null>;
}

function mapEditorial(item: {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  coverImage: string | null;
  author: string;
  category: string;
  featured: boolean;
  publishedAt: Date | null;
}): EditorialItem {
  // Approximate read time: ~200 words per minute
  const wordCount = item.excerpt ? item.excerpt.split(/\s+/).length : 0;
  const readTime = Math.max(3, Math.ceil(wordCount / 200));

  return {
    ...item,
    readTime,
  };
}

export function createEditorialService(): EditorialService {
  return {
    async listAll() {
      const items = await prisma.editorial.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          excerpt: true,
          coverImage: true,
          author: true,
          category: true,
          featured: true,
          publishedAt: true,
        },
      });
      return items.map(mapEditorial);
    },

    async listFeatured() {
      const items = await prisma.editorial.findMany({
        where: { status: "PUBLISHED", featured: true },
        orderBy: { publishedAt: "desc" },
        take: 4,
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          excerpt: true,
          coverImage: true,
          author: true,
          category: true,
          featured: true,
          publishedAt: true,
        },
      });
      return items.map(mapEditorial);
    },

    async getBySlug(slug: string) {
      const item = await prisma.editorial.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          excerpt: true,
          coverImage: true,
          author: true,
          category: true,
          featured: true,
          publishedAt: true,
        },
      });
      return item ? mapEditorial(item) : null;
    },
  };
}
