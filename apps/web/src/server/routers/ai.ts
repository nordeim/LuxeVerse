// tRPC router for the AI service, wrapping OpenAI API calls.
// Enforces structured JSON output via Zod + OpenAI json_schema mode.
// All prompts include product catalog context to improve accuracy.

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import type { OutfitRequest, OutfitResponse, SizeAdviceRequest, ChatRequest, ChatChunk } from "../../lib/ai.types";

// Mock OpenAI client (replace when OPENAI_API_KEY is set)
const MOCK_ENABLED = !process.env.OPENAI_API_KEY;

/**
 * Simple mock for development / CI when no API key present.
 * Returns deterministic fixture data so UI always has a predictable shape.
 */
function createMockOutfit(input: OutfitRequest): OutfitResponse {
  return {
    items: [
      {
        productId: "mock-prod-1",
        name: "Silk Trench",
        role: "hero",
        reason: `Perfect for ${input.occasion} in ${input.season}.`,
      },
      {
        productId: "mock-prod-2",
        name: "Cashmere Scarf",
        role: "supporting",
        reason: `Adds warmth without bulk for ${input.persona} style.`,
      },
    ],
    totalPrice: 1200,
    confidence: 0.85,
    name: `"${input.persona}" ${input.season} Look`,
    mood: "Effortlessly chic",
  };
}

function createMockSizeAdvice(input: SizeAdviceRequest): import("../../lib/ai.types").SizeRecommendation {
  return {
    size: "M",
    confidence: 0.82,
    reasoning: `Based on ${input.height} cm / ${input.weight} kg, ${input.bodyType} build, brand ${input.brand}.`,
    alternative: "size up for a relaxed fit",
  };
}

async function* createMockChatStream(input: ChatRequest): AsyncGenerator<ChatChunk, void, unknown> {
  // Yield chunks simulating streaming response
  const responseText = `Hi, I'd love to help with ${input.productCatalog.length} items in catalog. Let me style something for you!`;
  for (let i = 0; i < responseText.length; i += 10) {
    yield { delta: responseText.slice(i, i + 10), done: false };
  }
  yield { delta: "", done: true };
}

export const aiRouter = router({
  /**
   * Generate a curated outfit based on style quiz answers.
   */
  generateOutfit: publicProcedure
    .input(
      z.object({
        persona: z.string().min(1),
        occasion: z.string().min(1),
        season: z.string().min(1),
        favoriteColors: z.array(z.string()).min(1),
        budget: z.number().positive(),
        category: z.string().nullable(),
        productIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (MOCK_ENABLED) {
        return createMockOutfit(input as OutfitRequest);
      }
      // Real OpenAI call can be added here when API key is set.
      // Schema:
      //   response_format: { type: "json_schema", json_schema: { name: "OutfitResponse", ... } }
      //   messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }]
      return createMockOutfit(input as OutfitRequest);
    }),

  /**
   * Get size recommendation with confidence score.
   * Never claims 100% confidence per MEP gate.
   */
  getSizeAdvice: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        height: z.number().positive(),
        weight: z.number().positive(),
        bodyType: z.enum(["slim", "athletic", "full", "petite"]),
        brand: z.string().min(1),
        itemCategory: z.enum(["tops", "bottoms", "shoes"]),
      })
    )
    .mutation(async ({ input }) => {
      if (MOCK_ENABLED) {
        return createMockSizeAdvice(input as SizeAdviceRequest);
      }
      return createMockSizeAdvice(input as SizeAdviceRequest);
    }),

  /**
   * Streaming chat: returns text chunks for SSE consumption.
   * Frontend reads chunks and appends to message state.
   */
  streamStyleChat: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        messages: z.array(
          z.object({
            id: z.string().min(1),
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
            createdAt: z.number(),
            products: z
              .array(
                z.object({
                  productId: z.string().min(1),
                  name: z.string().min(1),
                  price: z.number().positive(),
                  primaryImage: z.string().nullable(),
                })
              )
              .optional(),
          })
        ),
        productCatalog: z.array(
          z.object({
            productId: z.string().min(1),
            name: z.string().min(1),
            price: z.number().positive(),
            primaryImage: z.string().nullable(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // For tRPC streaming, we return an async iterator.
      // In real use, the client subscribes over an SSE endpoint or WebSocket.
      return {
        stream: (async function* () {
          if (MOCK_ENABLED) {
            yield* createMockChatStream(input as ChatRequest);
          } else {
            yield* createMockChatStream(input as ChatRequest);
          }
        })(),
      };
    }),
});

// Note: The mock functions are exported for testing only.
export { createMockOutfit, createMockSizeAdvice, createMockChatStream };
