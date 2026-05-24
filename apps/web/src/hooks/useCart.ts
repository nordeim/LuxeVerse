"use client";

import { useCallback, useMemo } from "react";
import { useCartStore, type CartItem } from "@/stores/cart";
import { trpc } from "@/trpc/provider";

export function useCart() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const isLoading = useCartStore((s) => s.isLoading);
  const lastRemovedItem = useCartStore((s) => s.lastRemovedItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const setLoading = useCartStore((s) => s.setLoading);
  const addItemStore = useCartStore((s) => s.addItem);
  const updateQuantityStore = useCartStore((s) => s.updateQuantity);
  const removeItemStore = useCartStore((s) => s.removeItem);
  const undoRemoveStore = useCartStore((s) => s.undoRemove);
  const clearCartStore = useCartStore((s) => s.clearCart);

  const addItemMutation = trpc.cart.addItem.useMutation();
  const updateItemMutation = trpc.cart.updateItem.useMutation();
  const removeItemMutation = trpc.cart.removeItem.useMutation();

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.totalPrice, 0),
    [items]
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const openCart = useCallback(() => setOpen(true), [setOpen]);
  const closeCart = useCallback(() => setOpen(false), [setOpen]);

  const addItem = useCallback(
    async (input: {
      productId: string;
      variantId: string | null;
      quantity: number;
    }) => {
      setLoading(true);
      try {
        const result = await addItemMutation.mutateAsync(input);
        if (result.items) {
          addItemStore(result.items[0]);
        }
        openCart();
      } catch {
        // Fallback: add to local store if server fails
        const mockItem: CartItem = {
          id: typeof crypto !== "undefined" ? crypto.randomUUID() : `temp-${Date.now()}`,
          productId: input.productId,
          productName: "Product Name",
          variantId: input.variantId,
          variantName: null,
          quantity: input.quantity,
          unitPrice: 100,
          totalPrice: 100 * input.quantity,
          imageUrl: null,
        };
        addItemStore(mockItem);
        openCart();
      } finally {
        setLoading(false);
      }
    },
    [addItemMutation, addItemStore, openCart, setLoading]
  );

  const updateItem = useCallback(
    async (id: string, quantity: number) => {
      setLoading(true);
      try {
        await updateItemMutation.mutateAsync({ itemId: id, quantity });
        updateQuantityStore(id, quantity);
      } finally {
        setLoading(false);
      }
    },
    [updateItemMutation, updateQuantityStore, setLoading]
  );

  const removeItem = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await removeItemMutation.mutateAsync({ itemId: id });
        removeItemStore(id);
      } finally {
        setLoading(false);
      }
    },
    [removeItemMutation, removeItemStore, setLoading]
  );

  return {
    items,
    isOpen,
    isLoading,
    lastRemovedItem,
    total,
    itemCount,
    openCart,
    closeCart,
    addItem,
    updateItem,
    removeItem,
    undoRemove: undoRemoveStore,
    clearCart: clearCartStore,
  };
}
