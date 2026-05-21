import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchRouter } from "./search";
import { prisma } from "@/lib/prisma";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      groupBy: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}));

// Create a mock caller for the router
const createCaller = () => {
  return searchRouter.createCaller({ prisma } as any);
};

describe("searchRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("query", () => {
    it("should search products with default sort (createdAt)", async () => {
      const mockProducts = [
        {
          id: "prod-1",
          slug: "test-product",
          name: "Test Product",
          description: "A test product",
          price: 100,
          compareAtPrice: null,
          status: "ACTIVE",
          images: [{ url: "/test.jpg" }],
          category: { name: "Test", slug: "test" },
          brand: { name: "Test Brand" },
          _count: { variants: 2, reviews: 5 },
        },
      ];

      (prisma.product.findMany as any).mockResolvedValue(mockProducts);

      const caller = createCaller();
      const result = await caller.query({ q: "test" });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "prod-1",
        name: "Test Product",
        price: 100,
        primaryImage: "/test.jpg",
        category: "Test",
        brand: "Test Brand",
        rating: null,
        reviewCount: 0,
      });

      // Verify the query used the fallback orderBy (not 'relevance')  
      const findManyCall = (prisma.product.findMany as any).mock.calls[0][0];
      expect(findManyCall.orderBy).toEqual({ createdAt: "desc" });
    });

    it("should sort by price ascending", async () => {
      (prisma.product.findMany as any).mockResolvedValue([]);

      const caller = createCaller();
      await caller.query({ q: "test", sort: "price-asc" });

      const findManyCall = (prisma.product.findMany as any).mock.calls[0][0];
      expect(findManyCall.orderBy).toEqual({ price: "asc" });
    });

    it("should sort by price descending", async () => {
      (prisma.product.findMany as any).mockResolvedValue([]);

      const caller = createCaller();
      await caller.query({ q: "test", sort: "price-desc" });

      const findManyCall = (prisma.product.findMany as any).mock.calls[0][0];
      expect(findManyCall.orderBy).toEqual({ price: "desc" });
    });

    it("should sort by newest", async () => {
      (prisma.product.findMany as any).mockResolvedValue([]);

      const caller = createCaller();
      await caller.query({ q: "test", sort: "newest" });

      const findManyCall = (prisma.product.findMany as any).mock.calls[0][0];
      expect(findManyCall.orderBy).toEqual({ createdAt: "desc" });
    });

    it("should apply category filter", async () => {
      (prisma.product.findMany as any).mockResolvedValue([]);

      const caller = createCaller();
      await caller.query({ q: "test", category: "outerwear" });

      const findManyCall = (prisma.product.findMany as any).mock.calls[0][0];
      expect(findManyCall.where.AND).toContainEqual(
        expect.objectContaining({ category: { slug: "outerwear" } })
      );
    });

    it("should apply price range filters", async () => {
      (prisma.product.findMany as any).mockResolvedValue([]);

      const caller = createCaller();
      await caller.query({ q: "test", minPrice: 100, maxPrice: 500 });

      const findManyCall = (prisma.product.findMany as any).mock.calls[0][0];
      expect(findManyCall.where.AND).toContainEqual(
        expect.objectContaining({ price: { gte: 100 } })
      );
      expect(findManyCall.where.AND).toContainEqual(
        expect.objectContaining({ price: { lte: 500 } })
      );
    });
  });

  describe("suggestions", () => {
    it("should return product name suggestions", async () => {
      const mockProducts = [
        { name: "Obsidian Trench", slug: "obsidian-trench" },
        { name: "Champagne Silk", slug: "champagne-silk" },
      ];

      (prisma.product.findMany as any).mockResolvedValue(mockProducts);

      const caller = createCaller();
      const result = await caller.suggestions({ q: "silk" });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: "Obsidian Trench", slug: "obsidian-trench" });
    });
  });

  describe("facets", () => {
    it("should return category, brand, and price range facets", async () => {
      (prisma.product.groupBy as any)
        .mockResolvedValueOnce([
          { categoryId: "cat-1", _count: { id: 5 } },
          { categoryId: "cat-2", _count: { id: 3 } },
        ])
        .mockResolvedValueOnce([
          { brandId: "brand-1", _count: { id: 4 } },
          { brandId: "brand-2", _count: { id: 2 } },
        ]);

      (prisma.product.aggregate as any).mockResolvedValue({
        _min: { price: 50 },
        _max: { price: 500 },
      });

      const caller = createCaller();
      const result = await caller.facets({ q: "test" });

      expect(result.categories).toHaveLength(2);
      expect(result.brands).toHaveLength(2);
      expect(result.priceRange).toEqual({ min: 50, max: 500 });
    });
  });

  describe("trending", () => {
    it("should return trending product names", async () => {
      const mockProducts = [
        { name: "Summer Collection" },
        { name: "New Arrivals" },
      ];

      (prisma.product.findMany as any).mockResolvedValue(mockProducts);

      const caller = createCaller();
      const result = await caller.trending();

      expect(result).toEqual(["Summer Collection", "New Arrivals"]);
    });
  });
});
