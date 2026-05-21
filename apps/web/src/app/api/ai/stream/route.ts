// Next.js Route Handler for AI streaming chat via SSE
// Returns a ReadableStream of text chunks using SSE format

import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const message = `Hello! I'm your AI stylist. How can I help today?`;
      const words = message.split(" ");

      for (let i = 0; i < words.length; i++) {
        const delay = Math.floor(Math.random() * 50) + 20;
        await new Promise((r) => setTimeout(r, delay));
        const chunk = encoder.encode(`data: ${JSON.stringify({ delta: words[i] + " ", done: false })}\n\n`);
        controller.enqueue(chunk);
      }

      const doneChunk = encoder.encode(`data: ${JSON.stringify({ delta: "", done: true })}\n\n`);
      controller.enqueue(doneChunk);
      controller.close();
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
