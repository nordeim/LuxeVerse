"use client";

import { startTransition, useState } from "react";
import type { ReactElement } from "react";
import { Button } from "@luxeverse/ui";
import { useCart } from "@/hooks/useCart";

interface QuickAddButtonProps {
  productId: string;
}

export function QuickAddButton({ productId }: QuickAddButtonProps): ReactElement {
  const { addItem, isLoading } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (): void => {
    if (isAdded) return;

    startTransition(async () => {
      setIsAdded(true);
      await addItem({ productId, variantId: null, quantity: 1 });
    });
  };

  return (
    <Button
      variant="luxury"
      size="sm"
      onClick={handleQuickAdd}
      disabled={isLoading || isAdded}
      className="absolute bottom-4 left-0 right-0 mx-auto w-full opacity-0 translate-y-2 transition-all duration-300 ease-luxe group-hover:opacity-100 group-hover:translate-y-0"
    >
      {isAdded ? "Added" : "Quick Add"}
    </Button>
  );
}
