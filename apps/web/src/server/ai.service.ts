import type {
  OutfitRequest,
  OutfitResponse,
  OutfitItem,
  SizeAdviceRequest,
  SizeRecommendation,
  ChatRequest,
  ChatChunk,
} from "../lib/ai.types";
import { z } from "zod";

// ============================================================================
// Typed OpenAI Client (avoids `as any` casts)
// ============================================================================

interface OpenAIClient {
  chat: {
    completions: {
      create: (args: unknown) => Promise<unknown>;
    };
  };
}

function getOpenAIChat(client: OpenAIClient) {
  return client.chat.completions;
}

// ============================================================================
// Retry / Backoff Configuration
// ============================================================================

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = RETRY_CONFIG.maxRetries
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      const delay = Math.min(
        RETRY_CONFIG.baseDelayMs * 2 ** attempt,
        RETRY_CONFIG.maxDelayMs
      );
      await sleep(delay);
    }
  }
  throw lastError;
}

// ============================================================================
// AI Service Interface
// ============================================================================

export interface AIService {
  generateOutfit(input: OutfitRequest): Promise<OutfitResponse>;
  getSizeAdvice(input: SizeAdviceRequest): Promise<SizeRecommendation>;
  streamStyleChat(input: ChatRequest): AsyncGenerator<ChatChunk, void, unknown>;
}

// ============================================================================
// Prompt Templates
// ============================================================================

const OUTFIT_SYSTEM_PROMPT = `You are a luxury fashion stylist for LuxeVerse.
Generate outfits based on the user's style persona, occasion, season, and budget.
Return a JSON object with: items (array of product roles), totalPrice, confidence (max 0.99), name, mood.`;

const SIZE_SYSTEM_PROMPT = `You are a fashion fit expert.
Recommend the best size based on body measurements and brand sizing.
Return a JSON object with: size, confidence (max 0.99), reasoning, alternative (optional).`;

// ============================================================================
// Mock Implementations (fallback when no API key)
// ============================================================================

function createMockOutfit(input: OutfitRequest): OutfitResponse {
  const items: OutfitItem[] = [
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
    {
      productId: "mock-prod-3",
      name: "Leather Belt",
      role: "accessory",
      reason: `Completes the ${input.season} silhouette.`,
    },
  ];

  return {
    items,
    totalPrice: input.budget * 0.6,
    confidence: 0.85,
    name: `"${input.persona}" ${input.season} Look`,
    mood: "Effortlessly chic",
  };
}

function createMockSizeAdvice(input: SizeAdviceRequest): SizeRecommendation {
  return {
    size: input.bodyType === "petite" ? "XS" : input.bodyType === "full" ? "L" : "M",
    confidence: 0.82,
    reasoning: `Based on ${input.height} cm / ${input.weight} kg, ${input.bodyType} build, brand ${input.brand}.`,
    alternative: "size up for a relaxed fit",
  };
}

async function* createMockChatStream(input: ChatRequest): AsyncGenerator<ChatChunk, void, unknown> {
  const responseText = `I'd love to help style something for you! I see you have ${input.productCatalog.length} items in catalog to work with.`;
  const words = responseText.split(" ");
  for (const word of words) {
    yield { delta: word + " ", done: false };
  }
  yield { delta: "", done: true };
}

// ============================================================================
// Zod Runtime Validation for AI Structured Output
// ============================================================================

const outfitResponseSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      role: z.union([z.literal("hero"), z.literal("supporting"), z.literal("accessory")]),
      reason: z.string(),
    })
  ),
  totalPrice: z.number().nonnegative(),
  confidence: z.number().min(0).max(0.99),
  name: z.string(),
  mood: z.string(),
});

const sizeRecommendationSchema = z.object({
  size: z.string(),
  confidence: z.number().min(0).max(0.99),
  reasoning: z.string(),
  alternative: z.string().optional(),
});

// ============================================================================
// Response Extraction Helper (avoids deep `as any` chains)
// ============================================================================

function extractContentFromCompletion(completion: unknown): string {
  const c = completion as Record<string, unknown>;
  const choices = c.choices;
  if (!Array.isArray(choices) || choices.length === 0) return "{}";
  const first = choices[0] as Record<string, unknown>;
  const message = first.message as Record<string, unknown> | undefined;
  return typeof message?.content === "string" ? message.content : "{}";
}

// ============================================================================
// Real OpenAI Integration (typed client, no `as any`)
// ============================================================================

async function generateOutfitWithOpenAI(
  client: OpenAIClient,
  input: OutfitRequest
): Promise<OutfitResponse> {
  try {
    const completion = await withRetry(() =>
      getOpenAIChat(client).create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: OUTFIT_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Generate an outfit for:
Persona: ${input.persona}
Occasion: ${input.occasion}
Season: ${input.season}
Favorite Colors: ${input.favoriteColors.join(", ")}
Budget: $${input.budget}
Category: ${input.category ?? "any"}
${input.productIds ? `Products already owned: ${input.productIds.join(", ")}` : ""}`,
          },
        ],
        response_format: { type: "json_object" },
      })
    );

    const raw = extractContentFromCompletion(completion);
    const parsed = JSON.parse(raw);
    const validated = outfitResponseSchema.parse(parsed);

    return {
      ...validated,
      confidence: Math.min(validated.confidence, 0.99),
    };
  } catch {
    return createMockOutfit(input);
  }
}

async function getSizeAdviceWithOpenAI(
  client: OpenAIClient,
  input: SizeAdviceRequest
): Promise<SizeRecommendation> {
  try {
    const completion = await withRetry(() =>
      getOpenAIChat(client).create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SIZE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Recommend a size for:
Height: ${input.height}cm
Weight: ${input.weight}kg
Body Type: ${input.bodyType}
Brand: ${input.brand}
Item Category: ${input.itemCategory}`,
          },
        ],
        response_format: { type: "json_object" },
      })
    );

    const raw = extractContentFromCompletion(completion);
    const parsed = JSON.parse(raw);
    const validated = sizeRecommendationSchema.parse(parsed);

    return {
      ...validated,
      confidence: Math.min(validated.confidence, 0.99),
    };
  } catch {
    return createMockSizeAdvice(input);
  }
}

async function* streamStyleChatWithOpenAI(
  client: OpenAIClient,
  input: ChatRequest
): AsyncGenerator<ChatChunk, void, unknown> {
  try {
    const stream = (await getOpenAIChat(client).create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful fashion stylist." },
        ...input.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
    })) as AsyncIterable<Record<string, unknown>>;

    for await (const chunk of stream) {
      const choices = chunk.choices as unknown[] | undefined;
      if (!choices || !Array.isArray(choices)) continue;
      const first = choices[0] as Record<string, unknown> | undefined;
      if (!first) continue;
      const deltaObj = first.delta as Record<string, unknown> | undefined;
      const delta = typeof deltaObj?.content === "string" ? deltaObj.content : "";
      if (delta) {
        yield { delta, done: false };
      }
    }
    yield { delta: "", done: true };
  } catch {
    yield* createMockChatStream(input);
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createAIService(apiKey?: string): AIService {
  const hasKey = !!apiKey && apiKey.startsWith("sk-");

  if (!hasKey) {
    return {
      generateOutfit: (input) => Promise.resolve(createMockOutfit(input)),
      getSizeAdvice: (input) => Promise.resolve(createMockSizeAdvice(input)),
      streamStyleChat: (input) => createMockChatStream(input),
    };
  }

  // Dynamically import OpenAI only when key is present
  let openaiClient: OpenAIClient | null = null;

  return {
    async generateOutfit(input) {
      if (!openaiClient) {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({ apiKey }) as unknown as OpenAIClient;
      }
      return generateOutfitWithOpenAI(openaiClient, input);
    },

    async getSizeAdvice(input) {
      if (!openaiClient) {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({ apiKey }) as unknown as OpenAIClient;
      }
      return getSizeAdviceWithOpenAI(openaiClient, input);
    },

    async* streamStyleChat(input) {
      if (!openaiClient) {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({ apiKey }) as unknown as OpenAIClient;
      }
      yield* streamStyleChatWithOpenAI(openaiClient, input);
    },
  };
}

export function createMockAIService(): AIService {
  return createAIService(undefined);
}
