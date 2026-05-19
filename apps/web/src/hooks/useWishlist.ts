import { useCallback, useMemo } from "react";
import { useWishlistStore, type WishlistItem } from "@/stores/wishlist";

export function useWishlist(productId?: string, variantId?: string | null) {
  // Selector discipline: never .getState() in JSX
  const items = useWishlistStore((s) => s.items);
  const isLoading = useWishlistStore((s) => s.isLoading);
  const setLoading = useWishlistStore((s) => s.setLoading);
  const addItemStore = useWishlistStore((s) => s.addItem);
  const removeItemStore = useWishlistStore((s) => s.removeItem);
  const toggleItemStore = useWishlistStore((s) => s.toggleItem);

  const isInWishlist = useMemo(() => {
    if (!productId) return false;
    return items.some(
      (i) => i.productId === productId && i.variantId === (variantId ?? null)
    );
  }, [items, productId, variantId]);

  const addItem = useCallback(async (item: WishlistItem) => {
    setLoading(true);
    try {
      // TODO: Wire to tRPC mutation: await trpc.wishlist.addItem.mutate(item);
      addItemStore(item);
    } finally {
      setLoading(false);
    }
  }, [setLoading, addItemStore]);

  const removeItem = useCallback(async (pid: string, vid?: string | null) => {
    setLoading(true);
    try {
      // TODO: Wire to tRPC mutation: await trpc.wishlist.removeItem.mutate({ productId: pid, variantId: vid });
      removeItemStore(pid, vid);
    } finally {
      setLoading(false);
    }
  }, [setLoading, removeItemStore]);

  const toggleItem = useCallback(async (item: WishlistItem) => {
    setLoading(true);
    try {
      // TODO: Wire to tRPC toggle mutation
      toggleItemStore(item);
    } finally {
      setLoading(false);
    }
  }, [setLoading, toggleItemStore]);

  return { items, isInWishlist, isLoading, addItem, removeItem, toggleItem };
}
