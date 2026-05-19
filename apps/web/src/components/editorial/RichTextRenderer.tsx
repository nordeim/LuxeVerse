"use client";

import { ProductEmbed } from "./ProductEmbed";

export type RichTextBlock =
  | { type: "text"; value: string }
  | { type: "quote"; value: string; author?: string }
  | { type: "product-card"; productId: string; name: string; price: number; image: string };

export interface RichTextRendererProps {
  blocks: RichTextBlock[];
}

export function RichTextRenderer({ blocks }: RichTextRendererProps) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "text":
            return <p key={idx} className="text-base leading-relaxed text-obsidian-700">{block.value}</p>;

          case "quote":
            return (
              <blockquote key={idx} className="relative my-4 border-l-4 border-metallic-champagne pl-6 italic text-lg text-obsidian-800">
                <p className="mb-2">&ldquo;{block.value}&rdquo;</p>
                {block.author && <cite className="text-sm not-italic text-obsidian-500">— {block.author}</cite>}
              </blockquote>
            );

          case "product-card":
            return (
              <div key={idx} className="my-6 rounded-xl border border-obsidian-200 bg-obsidian-50 p-4 shadow-sm">
                <ProductEmbed product={block} />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
