"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@luxeverse/utils";
import { Button } from "@luxeverse/ui";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "./CartItem";
import { FreeShippingProgress } from "./FreeShippingProgress";

export interface CartDrawerProps {
  freeShippingThreshold?: number;
}

export function CartDrawer({ freeShippingThreshold = 50000 }: CartDrawerProps): JSX.Element {
  const { items, isOpen, total, itemCount, closeCart, isLoading } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(isOpen, drawerRef, triggerRef);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeCart]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[300] bg-obsidian-950/40 backdrop-blur-sm transition-opacity duration-300 ease-luxe",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed top-0 right-0 z-[400] flex h-full w-full max-w-md flex-col bg-obsidian-50 shadow-dramatic transition-transform duration-300 ease-luxe",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-obsidian-200 px-6 py-4">
          <h2 className="text-lg font-display font-medium text-obsidian-900">
            Shopping Bag ({itemCount})
          </h2>
          <button
            ref={triggerRef}
            onClick={closeCart}
            className="rounded-md p-2 text-obsidian-600 hover:bg-obsidian-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan transition-colors"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="text-4xl opacity-50" aria-hidden="true">
                <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-display text-obsidian-900">
                Your bag is empty
              </h3>
              <p className="text-sm text-obsidian-600 max-w-xs">
                Discover our latest collections and add your favorites.
              </p>
              <Button variant="luxury" onClick={closeCart} asChild>
                <Link href="/shop" onClick={closeCart}>
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-obsidian-200 px-6 py-6 flex flex-col gap-4 bg-obsidian-50">
            <FreeShippingProgress
              current={total}
              threshold={freeShippingThreshold}
              currency="USD"
            />
            <div className="flex items-center justify-between text-base font-semibold text-obsidian-900">
              <span>Subtotal</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-obsidian-600">
              Shipping and taxes calculated at checkout.
            </p>
            <Button variant="luxury" size="lg" className="w-full" disabled={isLoading} asChild>
              <Link href="/checkout" onClick={closeCart}>
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
