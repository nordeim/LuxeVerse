"use client";

import { useOptimistic, startTransition, useId } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import type { CartItem as CartItemType } from "@/stores/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps): ReactElement {
  const { updateItem, removeItem, isLoading } = useCart();
  const [optimisticQty, setOptimisticQty] = useOptimistic(
    item.quantity,
    (_prev: number, newQty: number) => newQty
  );
  const qtyId = useId();

  const handleUpdateQty = (newQty: number): void => {
    if (newQty < 1 || newQty === item.quantity) return;
    startTransition(async () => {
      setOptimisticQty(newQty);
      await updateItem(item.id, newQty);
    });
  };

  const handleRemove = (): void => {
    startTransition(async () => {
      await removeItem(item.id);
    });
  };

  return (
    <div className="flex gap-4 py-4 border-b border-obsidian-200 last:border-0">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-obsidian-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-obsidian-200" />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-obsidian-900 line-clamp-1">
              {item.productName}
            </span>
            {item.variantName && (
              <span className="text-xs text-obsidian-600">{item.variantName}</span>
            )}
          </div>
          <span className="text-sm font-semibold text-obsidian-900">
            {formatCurrency(item.totalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" role="group" aria-labelledby={qtyId}>
            <span id={qtyId} className="sr-only">
              Quantity
            </span>
            <button
              onClick={() => handleUpdateQty(optimisticQty - 1)}
              disabled={optimisticQty <= 1 || isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-obsidian-200 text-obsidian-600 hover:bg-obsidian-100 disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium text-obsidian-900">
              {optimisticQty}
            </span>
            <button
              onClick={() => handleUpdateQty(optimisticQty + 1)}
              disabled={isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-obsidian-200 text-obsidian-600 hover:bg-obsidian-100 disabled:opacity-50 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-xs font-medium text-obsidian-500 underline-offset-4 hover:text-neon-pink hover:underline disabled:opacity-50 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
