"use client";

import { useCallback, useMemo } from "react";
import { useWishlistStore, type WishlistItem } from "@/stores/wishlist";
import { trpc } from "@/trpc/provider";

export function useWishlist(productId?: string, variantId?: string | null) {
  // Selector discipline: never .getState() in JSX
  const items = useWishlistStore((s) => s.items);
  const isLoading = useWishlistStore((s) => s.isLoading);
  const setLoading = useWishlistStore((s) => s.setLoading);
  const addItemStore = useWishlistStore((s) => s.addItem);
  const removeItemStore = useWishlistStore((s) => s.removeItem);
  const toggleItemStore = useWishlistStore((s) => s.toggleItem);

  const addItemMutation = trpc.wishlist.addItem.useMutation();
  const removeItemMutation = trpc.wishlist.removeItem.useMutation();

  const isInWishlist = useMemo(() => {
    if (!productId) return false;
    return items.some(
      (i) => i.productId === productId && i.variantId === (variantId ?? null)
    );
  }, [items, productId, variantId]);

  const addItem = useCallback(async (item: WishlistItem) => {
    setLoading(true);
    try {
      await addItemMutation.mutateAsync(item);
      addItemStore(item);
    } catch {
      // Fallback: add to local store if server fails
      addItemStore(item);
    } finally {
      setLoading(false);
    }
  }, [addItemMutation, addItemStore, setLoading]);

  const removeItem = useCallback(async (pid: string, vid?: string | null) => {
    setLoading(true);
    try {
      await removeItemMutation.mutateAsync({ productId: pid, variantId: vid ?? null });
      removeItemStore(pid, vid);
    } catch {
      removeItemStore(pid, vid);
    } finally {
      setLoading(false);
    }
  }, [removeItemMutation, removeItemStore, setLoading]);

  const toggleItem = useCallback(async (item: WishlistItem) => {
    setLoading(true);
    try {
      if (isInWishlist) {
        await removeItemMutation.mutateAsync({ productId: item.productId, variantId: item.variantId ?? null });
        removeItemStore(item.productId, item.variantId);
      } else {
        await addItemMutation.mutateAsync(item);
        addItemStore(item);
      }
    } catch {
      // Fallback: toggle local store
      toggleItemStore(item);
    } finally {
      setLoading(false);
    }
  }, [addItemMutation, removeItemMutation, addItemStore, removeItemStore, toggleItemStore, setLoading, isInWishlist]);

  return { items, isInWishlist, isLoading, addItem, removeItem, toggleItem };
}
