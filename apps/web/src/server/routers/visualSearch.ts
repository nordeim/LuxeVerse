import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// In-memory store for visual search results (demo purposes)
// Production: integrate with Pinecone, Qdrant, or similar vector DB
interface VisualSearchResult {
  id: string;
  name: string;
  similarity: number;
  imageUrl: string;
  price: number;
  category: string;
  slug: string;
}

const mockVisualSearch = async (base64Image: string): Promise<VisualSearchResult[]> => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock results based on image length (deterministic for demo)
  const hash = base64Image.length % 3;

  if (hash === 0) {
    return [
      { id: "vis-1", name: "Midnight Silk Blazer", similarity: 0.94, imageUrl: "/products/blazer-1.jpg", price: 1200, category: "outerwear", slug: "midnight-silk-blazer" },
      { id: "vis-2", name: "Noir Tailored Coat", similarity: 0.87, imageUrl: "/products/coat-1.jpg", price: 1800, category: "outerwear", slug: "noir-tailored-coat" },
      { id: "vis-3", name: "Obsidian Trench", similarity: 0.82, imageUrl: "/products/trench-1.jpg", price: 950, category: "outerwear", slug: "obsidian-trench" },
    ];
  } else if (hash === 1) {
    return [
      { id: "vis-4", name: "Champagne Pleat Dress", similarity: 0.96, imageUrl: "/products/dress-1.jpg", price: 850, category: "dresses", slug: "champagne-pleat-dress" },
      { id: "vis-5", name: "Pearl Satin Gown", similarity: 0.89, imageUrl: "/products/gown-1.jpg", price: 2200, category: "dresses", slug: "pearl-satin-gown" },
    ];
  } else {
    return [
      { id: "vis-6", name: "Merino Cashmere Scarf", similarity: 0.91, imageUrl: "/products/scarf-1.jpg", price: 320, category: "accessories", slug: "merino-cashmere-scarf" },
      { id: "vis-7", name: "Leather Bucket Bag", similarity: 0.85, imageUrl: "/products/bag-1.jpg", price: 780, category: "accessories", slug: "leather-bucket-bag" },
    ];
  }
};

export const visualSearchRouter = router({
  search: publicProcedure
    .input(
      z.object({
        imageBase64: z.string().min(1, "Image data is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const results = await mockVisualSearch(input.imageBase64);
        return { results, count: results.length };
      } catch (error) {
        console.error("[VisualSearch] Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Visual search failed. Please try again.",
        });
      }
    }),
});
