import { useMemo } from "react";
import type { ReactElement } from "react";
import { cn } from "@luxeverse/utils";
import { Gift } from "lucide-react";

interface FreeShippingProgressProps {
  current: number;
  threshold: number;
  currency: string;
}

const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount / 100
  );

export function FreeShippingProgress({
  current,
  threshold,
  currency,
}: FreeShippingProgressProps): ReactElement {
  const progress = useMemo(
    () => Math.min((current / threshold) * 100, 100),
    [current, threshold]
  );
  const remaining = Math.max(threshold - current, 0);
  const isComplete = remaining === 0;

  return (
    <div
      className="flex flex-col gap-2 rounded-lg bg-obsidian-50 p-4"
      role="status"
      aria-label="Free shipping progress"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-obsidian-900 flex items-center gap-2">
          <Gift className="h-4 w-4 text-metallic-gold" aria-hidden="true" />
          {isComplete
            ? "You've unlocked complimentary shipping"
            : `Spend ${formatCurrency(remaining, currency)} more for free shipping`}
        </span>
        <span className="text-xs text-obsidian-600">
          {Math.round(progress)}%
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-obsidian-200"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-luxe",
            isComplete
              ? "bg-linear-to-r from-neon-lime to-neon-cyan"
              : "bg-linear-to-r from-metallic-champagne to-metallic-gold"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
