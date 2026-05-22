// Next.js Route Handler for AI streaming chat via SSE
// Delegates to ai.service.ts for real AI-powered streaming responses.
// Accepts user message history via the `messages` query parameter.

import { NextRequest } from "next/server";
import { createAIService } from "@/server/ai.service";
import type { ChatMessage } from "@/lib/ai.types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const productCatalogParam = searchParams.get("productCatalog");
  const messagesParam = searchParams.get("messages");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse optional product catalog from query string
  let productCatalog: { productId: string; name: string; price: number; primaryImage: string | null }[] = [];
  if (productCatalogParam) {
    try {
      productCatalog = JSON.parse(productCatalogParam) as typeof productCatalog;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid productCatalog JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Parse optional message history (JSON array of ChatMessage)
  let userMessages: ChatMessage[] = [];
  if (messagesParam) {
    try {
      userMessages = JSON.parse(messagesParam) as ChatMessage[];
    } catch {
      return new Response(JSON.stringify({ error: "Invalid messages JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const aiService = createAIService(process.env.OPENAI_API_KEY);

  const encoder = new TextEncoder();
  let streamClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Build messages array: system prompt + user history + current greeting
        const systemMessage: ChatMessage = {
          id: "system-1",
          role: "system",
          content: "You are a helpful luxury fashion stylist.",
          createdAt: Date.now(),
        };

        const messages: ChatMessage[] = [systemMessage, ...userMessages];

        // If no user messages provided, add a default greeting
        if (userMessages.length === 0) {
          messages.push({
            id: "user-greet",
            role: "user",
            content: "Hello! I'd like some styling advice.",
            createdAt: Date.now(),
          });
        }

        const chatInput = {
          userId,
          messages,
          productCatalog,
        };

        const generator = aiService.streamStyleChat(chatInput);

        for await (const chunk of generator) {
          if (streamClosed) break;
          const data = `data: ${JSON.stringify({ delta: chunk.delta, done: chunk.done })}

`;
          controller.enqueue(encoder.encode(data));
          if (chunk.done) break;
        }
      } catch {
        if (!streamClosed) {
          const errorData = `data: ${JSON.stringify({ delta: "", done: true, error: "Stream failed" })}

`;
          controller.enqueue(encoder.encode(errorData));
        }
      } finally {
        if (!streamClosed) {
          controller.close();
          streamClosed = true;
        }
      }
    },

    cancel() {
      streamClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
