// AI Types for LuxeVerse Phase 3
// Zero enums — use string unions (erasableSyntaxOnly)

/**
 * Request to generate a curated outfit
 */
export interface OutfitRequest {
  persona: string; // e.g. "romantic", "bold", "minimalist"
  occasion: string; // e.g. "cocktail", "gallery opening", "boardroom"
  season: string; // e.g. "spring", "summer", "fall", "winter"
  favoriteColors: string[];
  budget: number;
  category: string | null; // e.g. "tailoring", "outerwear"
  productIds?: string[]; // optional IDs of products user already owns
}

export interface OutfitItem {
  productId: string;
  name: string;
  role: "hero" | "supporting" | "accessory";
  reason: string;
}

export interface OutfitResponse {
  items: OutfitItem[];
  totalPrice: number;
  confidence: number; // 0.0 – 1.0, never 1.0
  name: string;
  mood: string;
}

export interface SizeAdviceRequest {
  userId: string;
  height: number; // cm
  weight: number; // kg
  bodyType: "slim" | "athletic" | "full" | "petite";
  brand: string;
  itemCategory: string; // "tops", "bottoms", "shoes"
}

export interface SizeRecommendation {
  size: string;
  confidence: number; // 0.0 – 1.0
  reasoning: string;
  alternative?: string; // e.g. "size up for a relaxed fit"
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  products?: ChatProduct[]; // inline product cards
}

export interface ChatProduct {
  productId: string;
  name: string;
  price: number;
  primaryImage: string | null;
}

export interface ChatChunk {
  delta: string;
  done: boolean;
  products?: ChatProduct[]; // product cards to render inline
}

export interface ChatRequest {
  userId: string;
  messages: ChatMessage[];
  productCatalog: ChatProduct[]; // available products to reference
}

/**
 * AI Service contract
 * Abstract interface so we can swap OpenAI → Anthropic → local model
 */
export interface AiService {
  generateOutfit(input: OutfitRequest): Promise<OutfitResponse>;
  getSizeAdvice(input: SizeAdviceRequest): Promise<SizeRecommendation>;
  streamStyleChat(input: ChatRequest): AsyncGenerator<ChatChunk, void, unknown>;
}
