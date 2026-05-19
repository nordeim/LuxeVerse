import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  variantId: string | null;
  addedAt: number;
}

export interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      addItem: (item) => set((state) => {
        const exists = state.items.some(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (exists) return {};
        return { items: [...state.items, { ...item, addedAt: Date.now() }] };
      }),

      removeItem: (productId, variantId = null) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.productId === productId && i.variantId === variantId)
        ),
      })),

      toggleItem: (item) => {
        const exists = get().items.some(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (exists) {
          get().removeItem(item.productId, item.variantId);
        } else {
          get().addItem(item);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "luxeverse-wishlist",
      // CRITICAL: Persist ONLY domain data. Zero UI state (isLoading, toasts, isOpen).
      partialize: (state) => ({ items: state.items }),
    }
  )
);
