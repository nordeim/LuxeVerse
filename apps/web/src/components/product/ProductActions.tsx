"use client";

import { useState, useCallback } from "react";
import { Button } from "@luxeverse/ui";
import { VariantSelector, type VariantOption } from "./VariantSelector";
import { SizeRecommendation } from "@/components/size/SizeRecommendation";
import type { SizeRecommendation as SizeRecommendationType } from "@/lib/ai.types";
import { useCartStore } from "@/stores/cart";

interface ProductActionsProps {
  productId: string;
  productName: string;
  colorOptions: VariantOption[];
  sizeOptions: VariantOption[];
  imageUrl: string | null;
}

export function ProductActions({
  productId,
  productName,
  colorOptions,
  sizeOptions,
  imageUrl,
}: ProductActionsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sizeRecommendation, setSizeRecommendation] =
    useState<SizeRecommendationType | null>(null);

  const addToCart = useCartStore((s) => s.addItem);

  // Derive selected variant; if both color and size options exist, we need both selected.
  // For simplicity, we allow any combination to determine the variant.
  const selectedVariantId =
    colorOptions.length > 0 && sizeOptions.length > 0
      ? selectedColor && selectedSize
        ? selectedColor // In a real app, this would map to the unique variant id
        : null
      : selectedColor ?? selectedSize ?? null;

  const canAddToCart =
    colorOptions.length === 0 && sizeOptions.length === 0
      ? true
      : colorOptions.length > 0 && sizeOptions.length > 0
        ? selectedColor !== null && selectedSize !== null
        : selectedVariantId !== null;

  const handleAddToCart = useCallback(() => {
    if (!canAddToCart) return;
    setIsAdding(true);

    const variantId = selectedVariantId;
    // Find the selected variant name for the cart item
    const variantName =
      colorOptions.find((o) => o.id === variantId)?.name ??
      sizeOptions.find((o) => o.id === variantId)?.name ??
      null;

    addToCart({
      id: `${productId}-${variantId ?? "default"}`,
      productId,
      productName,
      variantId: variantId ?? null,
      variantName,
      quantity: 1,
      unitPrice: 0, // Would be fetched from the variant price in a real app
      totalPrice: 0,
      imageUrl,
    });

    setIsAdding(false);
  }, [
    canAddToCart,
    selectedVariantId,
    productId,
    productName,
    imageUrl,
    addToCart,
    colorOptions,
    sizeOptions,
  ]);

  const handleGetSizeAdvice = useCallback(() => {
    // In a real app, this would call the tRPC mutation:
    // trpc.ai.getSizeAdvice.useMutation({ userId, height, weight, bodyType, brand, itemCategory })
    // For now, we simulate a response:
    setSizeRecommendation({
      size: "M",
      confidence: 0.87,
      reasoning:
        "Based on your measurements and the brand's sizing chart, Medium is the best fit for a tailored silhouette.",
      alternative: "L for a relaxed fit",
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {colorOptions.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-obsidian-700">Color</span>
          <VariantSelector
            type="color"
            options={colorOptions}
            selectedId={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>
      )}

      {sizeOptions.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-obsidian-700">Size</span>
          <VariantSelector
            type="size"
            options={sizeOptions}
            selectedId={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>
      )}

      {/* AI-Powered Size Recommendation */}
      <SizeRecommendation
        recommendation={sizeRecommendation}
        onGetAdvice={handleGetSizeAdvice}
      />

      <Button
        variant="luxury"
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isAdding || !canAddToCart}
      >
        {isAdding ? "Adding..." : "Add to Bag"}
      </Button>
    </div>
  );
}
