"use client";

import { useState } from "react";
import { Button } from "@luxeverse/ui";
import Image from "next/image";

export interface ProductEmbedProps {
  product: {
    productId: string;
    name: string;
    price: number;
    image: string;
  };
}

export function ProductEmbed({ product }: ProductEmbedProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (): void => {
    // TODO: Wire to cart mutation: await trpc.cart.addItem.mutate({ productId: product.productId, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-obsidian-100">
        <Image src={product.image} alt={product.name} width={64} height={80} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-medium text-obsidian-900">{product.name}</span>
        <span className="text-sm text-obsidian-600">${product.price}</span>
      </div>
      <Button
        variant="luxury"
        size="sm"
        onClick={handleQuickAdd}
        disabled={isAdded}
        className="whitespace-nowrap"
      >
        {isAdded ? "Added" : "Quick Add"}
      </Button>
    </div>
  );
}
