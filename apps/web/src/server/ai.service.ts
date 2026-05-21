import type {
  OutfitRequest,
  OutfitResponse,
  OutfitItem,
  SizeAdviceRequest,
  SizeRecommendation,
  ChatRequest,
  ChatChunk,
} from "../lib/ai.types";

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
    name: `\"${input.persona}\" ${input.season} Look`,
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
// Real OpenAI Integration (when API key is present)
// ============================================================================

async function generateOutfitWithOpenAI(
  client: unknown,
  input: OutfitRequest
): Promise<OutfitResponse> {
  const openai = client as typeof import("openai");

  try {
    const completion = await (openai as any).chat.completions.create({
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
    });

    const raw = (completion.choices[0]?.message?.content) ?? "{}";
    const parsed = JSON.parse(raw) as OutfitResponse;

    return {
      ...parsed,
      confidence: Math.min(parsed.confidence ?? 0.85, 0.99),
    };
  } catch {
    return createMockOutfit(input);
  }
}

async function getSizeAdviceWithOpenAI(
  client: unknown,
  input: SizeAdviceRequest
): Promise<SizeRecommendation> {
  const openai = client as typeof import("openai");

  try {
    const completion = await (openai as any).chat.completions.create({
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
    });

    const raw = (completion.choices[0]?.message?.content) ?? "{}";
    const parsed = JSON.parse(raw) as SizeRecommendation;

    return {
      ...parsed,
      confidence: Math.min(parsed.confidence ?? 0.82, 0.99),
    };
  } catch {
    return createMockSizeAdvice(input);
  }
}

async function* streamStyleChatWithOpenAI(
  client: unknown,
  input: ChatRequest
): AsyncGenerator<ChatChunk, void, unknown> {
  const openai = client as typeof import("openai");

  try {
    const stream = await (openai as any).chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful fashion stylist." },
        ...input.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
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
  let openaiClient: unknown = null;

  return {
    async generateOutfit(input) {
      if (!openaiClient) {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({ apiKey });
      }
      return generateOutfitWithOpenAI(openaiClient, input);
    },

    async getSizeAdvice(input) {
      if (!openaiClient) {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({ apiKey });
      }
      return getSizeAdviceWithOpenAI(openaiClient, input);
    },

    async* streamStyleChat(input) {
      if (!openaiClient) {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({ apiKey });
      }
      yield* streamStyleChatWithOpenAI(openaiClient, input);
    },
  };
}

export function createMockAIService(): AIService {
  return createAIService(undefined);
}
