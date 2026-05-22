// Next.js Route Handler for AI streaming chat via SSE
// Delegates to ai.service.ts for real AI-powered streaming responses.

import { NextRequest } from "next/server";
import { createAIService } from "@/server/ai.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const productCatalogParam = searchParams.get("productCatalog");

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

  const aiService = createAIService(process.env.OPENAI_API_KEY);

  const encoder = new TextEncoder();
  let streamClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const chatInput = {
          userId,
          messages: [
            {
              id: "system-1",
              role: "system" as const,
              content: "You are a helpful luxury fashion stylist.",
              createdAt: Date.now(),
            },
            {
              id: "user-greet",
              role: "user" as const,
              content: "Hello! I'd like some styling advice.",
              createdAt: Date.now(),
            },
          ],
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
