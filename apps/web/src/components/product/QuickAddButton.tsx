"use client";

import { useOptimistic, startTransition } from "react";
import { Button } from "@luxeverse/ui";
import { useCart } from "@/hooks/useCart";

interface QuickAddButtonProps {
  productId: string;
}

export function QuickAddButton({ productId }: QuickAddButtonProps): JSX.Element {
  const { addItem, isLoading } = useCart();
  const [optimisticAdded, setOptimisticAdded] = useOptimistic(false, () => true);

  const handleQuickAdd = (): void => {
    startTransition(async () => {
      setOptimisticAdded(false);
      await addItem({ productId, variantId: null, quantity: 1 });
    });
  };

  return (
    <Button
      variant="luxury"
      size="sm"
      onClick={handleQuickAdd}
      disabled={isLoading || optimisticAdded}
      className="absolute bottom-4 left-0 right-0 mx-auto w-full opacity-0 translate-y-2 transition-all duration-300 ease-luxe group-hover:opacity-100 group-hover:translate-y-0"
    >
      {optimisticAdded ? "Added" : "Quick Add"}
    </Button>
  );
}
