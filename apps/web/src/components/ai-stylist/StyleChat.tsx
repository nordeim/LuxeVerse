"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@luxeverse/utils";
import { Button } from "@luxeverse/ui";
import { Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  products?: ChatProduct[];
  isLoading?: boolean;
}

interface ChatProduct {
  productId: string;
  name: string;
  price: number;
  primaryImage: string | null;
}

interface StyleChatProps {
  userId: string;
  className?: string;
}

export function StyleChat({ userId, className }: StyleChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to your AI Stylist. Ask me about outfits, sizing, or trends.",
      createdAt: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isStreaming) return;

      const userMessageId = `msg-${Date.now()}`;
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: inputValue.trim(),
        createdAt: Date.now(),
      };

      const tempId = `temp-${Date.now()}`;
      const tempMessage: ChatMessage = {
        id: tempId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage, tempMessage]);
      setInputValue("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      fetch(`/api/ai/stream?userId=${encodeURIComponent(userId)}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.body) return;

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n\n");
              buffer = lines.pop() ?? "";

              for (const line of lines) {
                const match = line.match(/^data: (.+)$/m);
                if (!match) continue;

                try {
                  const chunk = JSON.parse(match[1]) as { delta: string; done: boolean };
                  if (chunk.done) {
                    setIsStreaming(false);
                    break;
                  }

                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempId
                        ? { ...msg, content: msg.content + chunk.delta, isLoading: false }
                        : msg
                    )
                  );
                } catch {
                  // Ignore parse errors in SSE
                }
              }
            }
          } finally {
            reader.releaseLock();
          }
        })
        .catch(() => {
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...msg,
                    content: "I'm having trouble connecting. Please try again.",
                    isLoading: false,
                  }
                : msg
            )
          );
        })
        .finally(() => {
          setIsStreaming(false);
          abortRef.current = null;
        });
    },
    [inputValue, isStreaming, userId]
  );

  return (
    <div className={cn("flex h-full flex-col bg-obsidian-950 text-obsidian-100", className)}>
      <div className="flex-1 overflow-y-auto space-y-6 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                msg.role === "user"
                  ? "bg-metallic-champagne text-obsidian-950"
                  : "bg-obsidian-800 text-obsidian-100"
              )}
            >
              <p>{msg.content}</p>
              {msg.isLoading && <Loader2 className="mt-2 h-4 w-4 animate-spin" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-obsidian-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your AI Stylist..."
            disabled={isStreaming}
            className="flex-1 rounded-lg bg-obsidian-900 px-4 py-2 text-sm text-obsidian-100 placeholder:text-obsidian-500 focus:outline-hidden focus:ring-2 focus:ring-neon-cyan"
            aria-label="Chat input"
          />
          <Button type="submit" variant="luxury" disabled={isStreaming}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
