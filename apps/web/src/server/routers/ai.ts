// tRPC router for the AI service.
// Delegates to ai.service.ts for actual AI logic.
// Thin layer: validation + delegation.

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { createAIService } from "../ai.service";
import type { OutfitRequest, SizeAdviceRequest, ChatRequest } from "../../lib/ai.types";

// Service instance — uses OPENAI_API_KEY when available, mock otherwise
const aiService = createAIService(process.env.OPENAI_API_KEY);

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
      return aiService.generateOutfit(input as OutfitRequest);
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
        bodyType: z.union([z.literal("slim"), z.literal("athletic"), z.literal("full"), z.literal("petite")]),
        brand: z.string().min(1),
        itemCategory: z.union([z.literal("tops"), z.literal("bottoms"), z.literal("shoes")]),
      })
    )
    .mutation(async ({ input }) => {
      return aiService.getSizeAdvice(input as SizeAdviceRequest);
    }),

  /**
   * Streaming chat: returns an async iterator over text chunks.
   * Frontend subscribes via SSE endpoint or processes the returned generator.
   */
  streamStyleChat: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        messages: z.array(
          z.object({
            id: z.string().min(1),
            role: z.union([z.literal("user"), z.literal("assistant"), z.literal("system")]),
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
      return {
        stream: aiService.streamStyleChat(input as ChatRequest),
      };
    }),
});
