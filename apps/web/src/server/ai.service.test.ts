import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { OutfitRequest, SizeAdviceRequest, ChatRequest, ChatChunk } from "../lib/ai.types";

// Mock OpenAI before importing the service
const mockCreate = vi.fn();
vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
  },
}));

import { createAIService, createMockAIService } from "./ai.service";

describe("createAIService", () => {
  beforeEach(() => {
    mockCreate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mock outfit when no API key provided", async () => {
    const service = createAIService(undefined);
    const outfit = await service.generateOutfit({
      persona: "minimalist",
      occasion: "cocktail",
      season: "autumn",
      favoriteColors: ["obsidian", "champagne"],
      budget: 2000,
      category: "tailoring",
    } as OutfitRequest);

    expect(outfit.items.length).toBeGreaterThan(0);
    expect(outfit.confidence).toBeLessThan(1);
    expect(outfit.confidence).toBeGreaterThan(0);
    expect(outfit.totalPrice).toBeGreaterThan(0);
  });

  it("returns deterministic size advice", async () => {
    const service = createAIService(undefined);
    const advice = await service.getSizeAdvice({
      userId: "user-123",
      height: 175,
      weight: 68,
      bodyType: "athletic",
      brand: "Saint Laurent",
      itemCategory: "bottoms",
    } as SizeAdviceRequest);

    expect(advice.size).toBeTruthy();
    expect(advice.confidence).toBeLessThan(1);
    expect(advice.confidence).toBeGreaterThan(0);
    expect(advice.reasoning).toContain("175");
  });

  it("streams chat chunks", async () => {
    const service = createAIService(undefined);
    const catalog = [
      { productId: "p1", name: "Test", price: 100, primaryImage: "/test.jpg" },
    ];
    const stream = service.streamStyleChat({
      userId: "user-1",
      messages: [{ id: "m1", role: "user", content: "Hello", createdAt: Date.now() }],
      productCatalog: catalog,
    } as ChatRequest);

    const chunks: ChatChunk[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThan(0);
    const last = chunks[chunks.length - 1];
    expect(last.done).toBe(true);
  });

  it("uses real OpenAI when API key is provided", async () => {
    const service = createAIService("sk-test-key");

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              items: [{ productId: "p1", name: "Test", role: "hero", reason: "Test" }],
              totalPrice: 100,
              confidence: 0.9,
              name: "Test Outfit",
              mood: "Chic",
            }),
          },
        },
      ],
    });

    const outfit = await service.generateOutfit({
      persona: "minimalist",
      occasion: "cocktail",
      season: "autumn",
      favoriteColors: ["obsidian"],
      budget: 1000,
      category: null,
    } as OutfitRequest);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(outfit.confidence).toBeLessThan(1);
  });

  it("handles OpenAI errors gracefully with fallback", async () => {
    const service = createAIService("sk-test-key");

    mockCreate.mockRejectedValueOnce(new Error("Network error"));

    const outfit = await service.generateOutfit({
      persona: "minimalist",
      occasion: "cocktail",
      season: "autumn",
      favoriteColors: ["obsidian"],
      budget: 1000,
      category: null,
    } as OutfitRequest);

    expect(outfit.items.length).toBeGreaterThan(0);
    expect(outfit.confidence).toBeLessThan(1);
  });
});

describe("createMockAIService", () => {
  it("returns deterministic mock data", async () => {
    const service = createMockAIService();
    const outfit1 = await service.generateOutfit({
      persona: "minimalist",
      occasion: "cocktail",
      season: "autumn",
      favoriteColors: ["obsidian"],
      budget: 1000,
      category: null,
    } as OutfitRequest);

    const outfit2 = await service.generateOutfit({
      persona: "minimalist",
      occasion: "cocktail",
      season: "autumn",
      favoriteColors: ["obsidian"],
      budget: 1000,
      category: null,
    } as OutfitRequest);

    expect(outfit1.items).toEqual(outfit2.items);
  });
});
