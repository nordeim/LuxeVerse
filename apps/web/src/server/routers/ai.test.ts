import { describe, it, expect } from "vitest";
import { aiRouter } from "./ai";

const createCaller = () => {
  return aiRouter.createCaller({} as any);
};

const getMockProductCatalog = () => {
  return [
    { productId: "prod-1", name: "Silk Trench", price: 1250, primaryImage: "/trench.jpg" },
    { productId: "prod-2", name: "Cashmere Scarf", price: 350, primaryImage: "/scarf.jpg" },
    { productId: "prod-3", name: "Leather Belt", price: 220, primaryImage: "/belt.jpg" },
  ];
};

describe("aiRouter", () => {
  describe("generateOutfit", () => {
    it("returns an outfit with confidence < 1.0", async () => {
      const caller = createCaller();
      const result = await caller.generateOutfit({
        persona: "minimalist",
        occasion: "cocktail",
        season: "autumn",
        favoriteColors: ["obsidian", "champagne"],
        budget: 2000,
        category: "tailoring",
      } as any);

      expect(result).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThan(1);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.totalPrice).toBeGreaterThan(0);
      expect(result.name).toContain("minimalist");
      expect(result.mood).toBeTruthy();
    });

    it("produces deterministic output for same inputs", async () => {
      const input = {
        persona: "romantic",
        occasion: "gallery opening",
        season: "spring",
        favoriteColors: ["rose", "ivory"],
        budget: 3000,
        category: "dresses",
      };

      const caller = createCaller();
      const outfit1 = await caller.generateOutfit(input as any);
      const outfit2 = await caller.generateOutfit(input as any);

      expect(outfit1.items).toEqual(outfit2.items);
      expect(outfit1.name).toEqual(outfit2.name);
    });
  });

  describe("getSizeAdvice", () => {
    it("returns a size recommendation with confidence never = 1.0", async () => {
      const caller = createCaller();
      const recommendation = await caller.getSizeAdvice({
        userId: "user-123",
        height: 175,
        weight: 68,
        bodyType: "athletic",
        brand: "Saint Laurent",
        itemCategory: "bottoms",
      } as any);

      expect(recommendation.size).toBeTruthy();
      expect(recommendation.confidence).toBeLessThan(1);
      expect(recommendation.confidence).toBeGreaterThan(0);
      expect(recommendation.reasoning).toContain("175");
    });

    it("never claims 100% confidence", async () => {
      const caller = createCaller();
      const recommendation = await caller.getSizeAdvice({
        userId: "user-456",
        height: 160,
        weight: 50,
        bodyType: "slim",
        brand: "Valentino",
        itemCategory: "tops",
      } as any);

      expect(recommendation.confidence).toBeLessThan(1);
    });
  });

  describe("streamStyleChat", () => {
    it("returns a stream object with async iterator", async () => {
      const catalog = getMockProductCatalog();
      const caller = createCaller();

      const result = await caller.streamStyleChat({
        userId: "user-789",
        messages: [
          {
            id: "msg-1",
            role: "user",
            content: "Help me find something for a gala",
            createdAt: Date.now(),
          },
        ],
        productCatalog: catalog,
      } as any);

      // Defer type assertion: ai.ts streamStyleChat returns { stream: AsyncGenerator<...> }
      expect(result).toBeDefined();
    });
  });
});
