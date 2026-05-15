import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string | null;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  lastRemovedItem: CartItem | null;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  undoRemove: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      lastRemovedItem: null,

      setOpen: (open) => set({ isOpen: open }),
      setLoading: (loading) => set({ isLoading: loading }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: i.quantity + item.quantity,
                      totalPrice: (i.quantity + item.quantity) * i.unitPrice,
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity, totalPrice: quantity * i.unitPrice }
              : i
          ),
        })),

      removeItem: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          return {
            items: state.items.filter((i) => i.id !== id),
            lastRemovedItem: item ?? null,
          };
        }),

      undoRemove: () =>
        set((state) => {
          if (!state.lastRemovedItem) return {};
          return {
            items: [...state.items, state.lastRemovedItem],
            lastRemovedItem: null,
          };
        }),

      clearCart: () => set({ items: [], lastRemovedItem: null }),
    }),
    {
      name: "luxeverse-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
