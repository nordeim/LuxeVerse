"use client";

import { useState } from "react";
import { trpc } from "@/trpc/server";
import Image from "next/image";
import type { UGCContent } from "@prisma/client";

interface UGCGalleryProps {
  userId?: string;
}

export function UGCGallery({ userId }: UGCGalleryProps) {
  const { data: contents } = trpc.ugc.list.useQuery(
    userId ? { userId } : undefined
  );

  const [selected, setSelected] = useState<UGCContent | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {contents?.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="relative aspect-square rounded-lg overflow-hidden group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan"
            aria-label={item.caption ?? "User uploaded content"}
          >
            <Image
              src={item.url}
              alt={item.caption ?? "User content"}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-white text-sm truncate">{item.caption}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <UGCModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function UGCModal({
  item,
  onClose,
}: {
  item: UGCContent;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="bg-obsidian-50 rounded-lg overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={item.url}
            alt={item.caption ?? "User content"}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <p className="text-obsidian-700">{item.caption}</p>
          <div className="flex gap-2 mt-4">
            {item.productTags?.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-obsidian-100 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
